/**
 * Promo Codes API Routes
 * 
 * HTTP endpoints for promo code validation and management
 */

import { Router } from 'express';
import { promoCodeService } from '../services/promoCode';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

/**
 * @route   POST /api/promocodes/validate
 * @desc    Validate a promo code
 * @access  Private
 */
router.post('/validate', authenticate, async (req: any, res) => {
  try {
    const { code, planId, billingInterval, purchaseAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Promo code is required',
        code: 'MISSING_CODE',
      });
    }

    const result = await promoCodeService.validatePromoCode(
      code,
      req.user.id,
      planId,
      billingInterval,
      purchaseAmount
    );

    if (!result.valid) {
      return res.status(400).json({
        valid: false,
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
      });
    }

    res.json({
      valid: true,
      discountAmount: result.discountAmount,
      promoCode: {
        code: result.promoCode.code,
        description: result.promoCode.description,
        discountType: result.promoCode.discountType,
        discountValue: result.promoCode.discountValue,
      },
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      error: 'Failed to validate promo code',
      code: 'VALIDATION_ERROR',
    });
  }
});

/**
 * @route   POST /api/promocodes/apply
 * @desc    Apply a promo code to a subscription
 * @access  Private
 */
router.post('/apply', authenticate, async (req: any, res) => {
  try {
    const { code, planId, billingInterval, purchaseAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Promo code is required',
        code: 'MISSING_CODE',
      });
    }

    // Validate first
    const validationResult = await promoCodeService.validatePromoCode(
      code,
      req.user.id,
      planId,
      billingInterval,
      purchaseAmount
    );

    if (!validationResult.valid) {
      return res.status(400).json({
        valid: false,
        errorCode: validationResult.errorCode,
        errorMessage: validationResult.errorMessage,
      });
    }

    // Store the applied promo code in session or return for use
    res.json({
      valid: true,
      discountAmount: validationResult.discountAmount,
      appliedCode: {
        code: validationResult.promoCode.code,
        discountType: validationResult.promoCode.discountType,
        discountValue: validationResult.promoCode.discountValue,
      },
    });
  } catch (error) {
    console.error('Error applying promo code:', error);
    res.status(500).json({
      error: 'Failed to apply promo code',
      code: 'APPLY_ERROR',
    });
  }
});

/**
 * @route   GET /api/promocodes
 * @desc    Get all active promo codes
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const result = await promoCodeService.getActivePromoCodes();
    res.json({
      success: true,
      data: result.promoCodes.map((promo: any) => ({
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        isActive: promo.is_active,
      })),
    });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({
      error: 'Failed to fetch promo codes',
      code: 'FETCH_ERROR',
    });
  }
});

/**
 * @route   POST /api/promocodes
 * @desc    Create a new promo code (admin only)
 * @access  Private (admin)
 */
router.post('/', authenticate, requirePermission('promocodes:create'), async (req: any, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      currency,
      minPurchaseAmount,
      maxDiscountAmount,
      usageLimit,
      appliesToPlanIds,
      appliesToBillingInterval,
      startDate,
      endDate,
    } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({
        error: 'Code, discount type, and discount value are required',
        code: 'MISSING_FIELDS',
      });
    }

    const result = await promoCodeService.createPromoCode({
      code,
      description,
      discountType,
      discountValue,
      currency,
      minPurchaseAmount,
      maxDiscountAmount,
      usageLimit,
      appliesToPlanIds,
      appliesToBillingInterval,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      createdBy: req.user.id,
    });

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        code: 'CREATION_FAILED',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        id: result.promoCode.id,
        code: result.promoCode.code,
        description: result.promoCode.description,
        discountType: result.promoCode.discountType,
        discountValue: result.promoCode.discountValue,
        isActive: result.promoCode.is_active,
      },
    });
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({
      error: 'Failed to create promo code',
      code: 'CREATION_ERROR',
    });
  }
});

/**
 * @route   PUT /api/promocodes/:code/deactivate
 * @desc    Deactivate a promo code (admin only)
 * @access  Private (admin)
 */
router.put('/:code/deactivate', authenticate, requirePermission('promocodes:update'), async (req: any, res) => {
  try {
    const { code } = req.params;
    const result = await promoCodeService.deactivatePromoCode(code);

    res.json({
      success: result.success,
      message: result.success ? 'Promo code deactivated' : result.error,
    });
  } catch (error) {
    console.error('Error deactivating promo code:', error);
    res.status(500).json({
      error: 'Failed to deactivate promo code',
      code: 'DEACTIVATION_ERROR',
    });
  }
});

export default router;
