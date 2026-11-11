"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { siteConfig } from "@/config/site";
import { initializeTracking, notifyRouteChange } from "@/lib/tracking-client";

const trackingConfiguration = {
  ga4MeasurementId: siteConfig.analytics.ga4MeasurementId,
  googleAdsId: siteConfig.analytics.googleAdsId,
  googleAdsSalesLeadDestination: siteConfig.analytics.googleAdsSalesLeadDestination,
  hubSpotPortalId: siteConfig.analytics.hubSpotPortalId,
  metaPixelId: siteConfig.analytics.metaPixelId,
};

export function TrackingProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initializeTracking(trackingConfiguration);
  }, []);

  useEffect(() => {
    notifyRouteChange(pathname);
  }, [pathname]);

  return null;
}
