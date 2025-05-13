"use client";

import { Box, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import InventoryIcon from '@mui/icons-material/Inventory';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import GavelIcon from '@mui/icons-material/Gavel';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import PersonIcon from '@mui/icons-material/Person';

const analyticsTabs = [
  {
    text: "Inventory",
    href: "/dashboard/auditor-analytics/inventory",
    description: "Track and analyze your call inventory with detailed metrics on call types, duration, and language distribution. Monitor call volumes and gain insights into communication patterns.",
    icon: <InventoryIcon color="primary" sx={{ fontSize: 32 }} />
  },
  {
    text: "Productivity",
    href: "/dashboard/auditor-analytics/productivity",
    description: "Measure and optimize agent performance with comprehensive productivity metrics. Track call handling times, resolution rates, and operational efficiency.",
    icon: <SpeedIcon color="primary" sx={{ fontSize: 32 }} />
  },
  {
    text: "Quality",
    href: "/dashboard/auditor-analytics/quality",
    description: "Monitor and improve call quality standards with detailed quality metrics. Track adherence to protocols, communication effectiveness, and service excellence.",
    icon: <VerifiedIcon color="primary" sx={{ fontSize: 32 }} />
  },
  {
    text: "Compliance",
    href: "/dashboard/auditor-analytics/compliance",
    description: "Ensure regulatory compliance and risk management with detailed compliance metrics. Monitor adherence to healthcare regulations and privacy standards.",
    icon: <GavelIcon color="primary" sx={{ fontSize: 32 }} />
  },
  {
    text: "Patient Satisfaction",
    href: "/dashboard/auditor-analytics/patient-satisfaction",
    description: "Gauge patient experience and satisfaction levels through comprehensive feedback analysis. Track satisfaction scores and identify areas for improvement.",
    icon: <SentimentSatisfiedIcon color="primary" sx={{ fontSize: 32 }} />
  },
  {
    text: "Agent Scorecard",
    href: "/dashboard/auditor-analytics/agent-insights",
    description: "Gain detailed insights into individual agent performance and development opportunities. Track skill development, training needs, and performance trends.",
    icon: <PersonIcon color="primary" sx={{ fontSize: 32 }} />
  }
];

export default function AuditorAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentTab = analyticsTabs.find(tab => tab.href === pathname) || analyticsTabs[0];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        mb: 4,
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 2
      }}>
        {currentTab.icon}
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {currentTab.text}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentTab.description}
          </Typography>
        </Box>
      </Box>
      {children}
    </Box>
  );
} 