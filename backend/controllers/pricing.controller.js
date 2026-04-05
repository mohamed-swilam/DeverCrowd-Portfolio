const Pricing = require("../models/pricing.schema");
const httpResponse = require("../utils/httpResponse");
const errorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middlewares/asyncWrapper");

// ─── Allowed fields (sanitize req.body — never spread it directly) ─────────────
function pickPlanFields(body) {
  const {
    serviceType,
    billingCycle,
    title,
    slug,
    description,
    originalPrice,
    discountPercent,
    currency,
    features,
    highlighted,
    sortOrder,
    isActive,
  } = body;

  return {
    ...(title !== undefined && { title: String(title).trim() }),
    ...(slug !== undefined && {
      slug: String(slug).toLowerCase().trim().replace(/\s+/g, "-"),
    }),
    ...(description !== undefined && {
      description: String(description).trim(),
    }),
    ...(originalPrice !== undefined && {
      originalPrice: Number(originalPrice),
    }),
    ...(currency !== undefined && {
      currency: String(currency).trim() || "USD",
    }),
    ...(Array.isArray(features) && {
      features: features.map((f) => String(f).trim()).filter(Boolean),
    }),
    ...(highlighted !== undefined && { highlighted: Boolean(highlighted) }),
    ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
    ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    ...(billingCycle !== undefined && {
      billingCycle: ["monthly", "yearly", "one-time"].includes(billingCycle)
        ? billingCycle
        : "monthly",
    }),
    ...(serviceType !== undefined && {
      serviceType: ["web", "mobile", "web+mobile", "shopify"].includes(serviceType)
        ? serviceType
        : "web",
    }),
    ...(discountPercent !== undefined && {
      discountPercent: Number(discountPercent) || 0,
    }),
  };
}

// ─── GET /api/pricing  (public — active plans only) ───────────────────────────
const getPublic = asyncWrapper(async (req, res) => {
  const plans = await Pricing.find({ isActive: true })
    .sort({ sortOrder: 1, originalPrice: 1 })
    .lean();

  res.json({
    status: httpResponse.status.ok,
    message: "Pricing plans fetched",
    data: { plans },
  });
});

// ─── GET /api/pricing/manage/all  (admin — all plans) ─────────────────────────
const getAll = asyncWrapper(async (req, res) => {
  const plans = await Pricing.find()
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  res.json({
    status: httpResponse.status.ok,
    message: "All pricing plans",
    data: { plans },
  });
});

// ─── POST /api/pricing/manage  (admin — create) ───────────────────────────────
const createPlan = asyncWrapper(async (req, res, next) => {
  const fields = pickPlanFields(req.body);

  // Validate required fields
  if (
    !fields.title ||
    !fields.slug ||
    fields.originalPrice === undefined ||
    isNaN(fields.originalPrice)
  ) {
    return next(
      errorHandler.create(
        "Title, slug, and valid price are required",
        httpResponse.status.badrequest,
      ),
    );
  }

  // Check slug uniqueness
  const exists = await Pricing.findOne({ slug: fields.slug });
  if (exists) {
    return next(
      errorHandler.create("Slug already exists", httpResponse.status.conflict),
    );
  }
  if (fields.discountPercent) {
    fields.realPrice = Math.round(
      fields.originalPrice -
        (fields.originalPrice * fields.discountPercent) / 100,
    );
  } else {
    fields.realPrice = fields.originalPrice;;
  }
  const plan = new Pricing(fields);
  await plan.save();

  res.status(201).json({
    status: httpResponse.status.created,
    message: "Plan created",
    data: { plan },
  });
});

// ─── PUT /api/pricing/manage/:id  (admin — update) ────────────────────────────
const updatePlan = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const fields = pickPlanFields(req.body);

  // If slug is being changed, check it's not taken by another plan
  if (fields.slug) {
    const conflict = await Pricing.findOne({
      slug: fields.slug,
      _id: { $ne: id },
    });
    if (conflict) {
      return next(
        errorHandler.create(
          "Slug already used by another plan",
          httpResponse.status.conflict,
        ),
      );
    }
  }
  if (fields.discountPercent) {
    fields.realPrice = Math.round(
      fields.originalPrice -
        (fields.originalPrice * fields.discountPercent) / 100,
    );
  }
  const plan = await Pricing.findByIdAndUpdate(id, fields, {
    new: true,
    runValidators: true,
  });

  if (!plan) {
    return next(
      errorHandler.create("Plan not found", httpResponse.status.notfound),
    );
  }

  res.json({
    status: httpResponse.status.ok,
    message: "Plan updated",
    data: { plan },
  });
});

// ─── DELETE /api/pricing/manage/:id  (admin — delete) ─────────────────────────
const deletePlan = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const plan = await Pricing.findByIdAndDelete(id);

  if (!plan) {
    return next(
      errorHandler.create("Plan not found", httpResponse.status.notfound),
    );
  }

  res.json({
    status: httpResponse.status.ok,
    message: "Plan deleted",
    data: null,
  });
});

module.exports = {
  getPublic,
  getAll,
  createPlan,
  updatePlan,
  deletePlan,
};
