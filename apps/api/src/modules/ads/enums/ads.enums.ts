export enum AdGoal {
  PROMOTE_BUSINESS = 'promote_business',
  PROMOTE_JOB = 'promote_job',
  PROMOTE_PRODUCT = 'promote_product',
  PROMOTE_COMPANY = 'promote_company',
}

export enum AdFormat {
  BANNER = 'banner',
  SIDEBAR = 'sidebar',
  SPONSORED_JOB = 'sponsored_job',
  SPONSORED_PRODUCT = 'sponsored_product',
}

export enum CampaignStatus {
  PENDING_PAYMENT = 'pending_payment',
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum PaymentGateway {
  FLUTTERWAVE = 'flutterwave',
  PAYSTACK = 'paystack',
}
