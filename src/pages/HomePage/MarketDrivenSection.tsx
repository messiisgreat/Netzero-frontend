import React, { lazy } from 'react'

const SectionTitle = lazy(() => import('../../components/SectionTitle'))

/* -------------------------------------------------------------------- */

export default function MarketDrivenSection() {
  return (
    <div className="bg-gradient-to-t from-[#1EA8AA] to-blue-900 py-12 lg:py-24">
      <div className="container max-w-5xl mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-2 items-center gap-10">
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-3 lg:gap-6">
            <SectionTitle title="Market Driven Pricing" className="text-white" />
            <p className="text-white text-center lg:text-left mt-6 lg:mt-0">
              Currently, carbon removal prices are set by farmers. Soon, the price will be dynamically set by the market using the NORI Token (launching 2023).
            </p>
            <p className="text-white text-center lg:text-left">
              100% of each tonne you pay for goes directly to supporting our suppliers, while we collect an additional 15% transaction fee to keep the marketplace running.
            </p>
            <p className="text-white text-center lg:text-left">
              Like a gift card, one NORI will always be redeemable for one tonne of carbon removal.
            </p>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <img src="/assets/images/nori_nrt_relationship_dark.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}