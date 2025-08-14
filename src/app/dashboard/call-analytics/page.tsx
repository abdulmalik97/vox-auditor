"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  Download,
  FilterAlt,
  Refresh,
  Assessment,
  Storage,
  TrendingUp,
  Language,
  LocationOn,
  Psychology,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * Voxology AI – Call Analytics Dashboard
 * A comprehensive dashboard for analyzing call performance, resolution rates, and feature adoption
 */

// Types
type CallLog = {
  id: string;
  timestamp: string;
  location: string;
  language: string;
  scope: "in" | "out";
  intent: string;
  resolved: boolean;
  duration_sec: number;
  features_used: string[];
};

// Chart colors
const COLORS = {
  primary: "#004c8b",
  secondary: "#1976d2",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",
  purple: "#9c27b0",
  teal: "#009688",
  pink: "#e91e63",
  indigo: "#3f51b5",
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.error];

// Mock data generator
const mockData: CallLog[] = Array.from({ length: 900 }).map((_, i) => {
  // More realistic day distribution - some days busier than others
  const dayWeights = [0.8, 1.2, 1.1, 1.3, 1.4, 0.9, 0.6]; // Mon-Sun weights
  const baseDay = 1 + Math.floor(Math.random() * 30);
  const dayOfWeek = baseDay % 7;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Realistic location distribution (Main Clinic gets more calls)
  const locationRand = Math.random();
  const location = locationRand < 0.7 ? "Main Clinic" : "East Austin";
  
  // Language distribution - English more common but varies by location
  const langRand = Math.random();
  const language = location === "Main Clinic" 
    ? (langRand < 0.75 ? "English" : "Spanish")
    : (langRand < 0.55 ? "English" : "Spanish");
  
  // More realistic scope distribution - most calls are in-scope
  const scopeRand = Math.random();
  const scope = scopeRand < 0.85 ? "in" : "out";
  
  // Weighted intent distribution - some intents more common
  const intentWeights = [
    { intent: "Appointment Scheduling", weight: 0.30 },
    { intent: "Reschedule/Cancel", weight: 0.20 },
    { intent: "Confirm Existing Appointment", weight: 0.15 },
    { intent: "General Inquiry", weight: 0.12 },
    { intent: "Prescription Refill", weight: 0.10 },
    { intent: "Insurance Questions", weight: 0.08 },
    { intent: "Medical Records", weight: 0.03 },
    { intent: "Test Results", weight: 0.02 },
  ];
  let intentRand = Math.random();
  let intent = "General Inquiry";
  for (const item of intentWeights) {
    if (intentRand < item.weight) {
      intent = item.intent;
      break;
    }
    intentRand -= item.weight;
  }
  
  // Resolution varies by intent and scope
  let resolvedProb = 0.5;
  if (scope === "in") {
    switch (intent) {
      case "Appointment Scheduling": resolvedProb = 0.92; break;
      case "Confirm Existing Appointment": resolvedProb = 0.95; break;
      case "Reschedule/Cancel": resolvedProb = 0.88; break;
      case "Prescription Refill": resolvedProb = 0.75; break;
      case "Insurance Questions": resolvedProb = 0.65; break;
      case "Test Results": resolvedProb = 0.85; break;
      case "Medical Records": resolvedProb = 0.70; break;
      default: resolvedProb = 0.80;
    }
  } else {
    resolvedProb = 0.15; // Out-of-scope calls rarely resolved
  }
  const resolved = Math.random() < resolvedProb;
  
  // Feature usage varies by language and call complexity
  const features_used: string[] = [];
  if (language === "Spanish" && Math.random() < 0.25) {
    features_used.push("realtime_language_switch");
  }
  if (intent === "Insurance Questions" && Math.random() < 0.15) {
    features_used.push("voice_synthesis");
  }
  if (Math.random() < 0.05) { // Some calls use both
    if (!features_used.includes("realtime_language_switch")) features_used.push("realtime_language_switch");
    if (!features_used.includes("voice_synthesis")) features_used.push("voice_synthesis");
  }
  
  // More realistic duration distribution
  let baseDuration = 120; // 2 minutes base
  switch (intent) {
    case "Confirm Existing Appointment": baseDuration = 45; break;
    case "Appointment Scheduling": baseDuration = 180; break;
    case "Insurance Questions": baseDuration = 240; break;
    case "Medical Records": baseDuration = 200; break;
    case "Prescription Refill": baseDuration = 90; break;
    case "Reschedule/Cancel": baseDuration = 105; break;
    case "Test Results": baseDuration = 150; break;
  }
  
  // Add randomness and factor in resolution status
  const durationVariance = Math.random() * 120 - 60; // ±60 seconds
  const resolutionFactor = resolved ? 1.0 : 1.3; // Unresolved calls tend to be longer
  const languageFactor = language === "Spanish" ? 1.15 : 1.0; // Spanish calls slightly longer
  
  const duration_sec = Math.max(30, Math.round(
    (baseDuration + durationVariance) * resolutionFactor * languageFactor
  ));
  
  // More realistic timestamp distribution - busier during business hours
  const hour = isWeekend ? 10 + Math.floor(Math.random() * 6) : 8 + Math.floor(Math.random() * 10);
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  
  return {
    id: `call_${i}`,
    timestamp: `2024-12-${String(baseDay).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}Z`,
    location,
    language,
    scope,
    intent,
    resolved,
    duration_sec,
    features_used,
  };
});

// Utility functions
function toCSV<T extends object>(rows: T[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) =>
    typeof v === "string" && (v.includes(",") || v.includes("\n") || v.includes('"'))
      ? '"' + v.replace(/"/g, '""') + '"'
      : v;
  const lines = [headers.join(",")].concat(
    rows.map((r) => headers.map((h) => escape((r as any)[h] ?? "")).join(","))
  );
  return lines.join("\n");
}

function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CallAnalyticsDashboard() {
  const [raw, setRaw] = useState<CallLog[]>([]);
  
  // Global filters
  const [from, setFrom] = useState<string>(formatDate(new Date("2024-12-01")));
  const [to, setTo] = useState<string>(formatDate(new Date("2024-12-31")));
  const [loc, setLoc] = useState<string>("All");
  const [lang, setLang] = useState<string>("All");
  const [intent, setIntent] = useState<string>("All");

  useEffect(() => {
    setRaw(mockData);
  }, []);

  // Apply filters
  const filtered = useMemo(() => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    return raw.filter((r) => {
      const t = new Date(r.timestamp);
      const inRange = t >= fromDate && t <= toDate;
      const matchLoc = loc === "All" || r.location === loc;
      const matchLang = lang === "All" || r.language === lang;
      const matchIntent = intent === "All" || r.intent === intent;
      return inRange && matchLoc && matchLang && matchIntent;
    });
  }, [raw, from, to, loc, lang, intent]);

  // KPI calculations
  const totalCalls = filtered.length;
  const inScope = filtered.filter((r) => r.scope === "in").length;
  const outScope = filtered.filter((r) => r.scope === "out").length;
  const success = filtered.filter((r) => r.resolved).length;
  const successRate = inScope ? Math.round((success / inScope) * 100) : 0;
  const avgDuration = filtered.length ? Math.round(filtered.reduce((sum, r) => sum + r.duration_sec, 0) / filtered.length) : 0;

  // Time series by day
  const byDay = useMemo(() => {
    const map: Record<string, { date: string; total: number; inScope: number; outScope: number; resolved: number }> = {};
    for (const r of filtered) {
      const key = r.timestamp.slice(0, 10);
      if (!map[key]) map[key] = { date: key, total: 0, inScope: 0, outScope: 0, resolved: 0 };
      map[key].total++;
      if (r.scope === "in") {
        map[key].inScope++;
      } else {
        map[key].outScope++;
      }
      if (r.resolved) map[key].resolved++;
    }
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  // Scope distribution
  const scopeDist = [
    { name: "In-Scope", value: inScope, color: COLORS.success },
    { name: "Out-of-Scope", value: outScope, color: COLORS.warning },
  ];

  // Resolution by intent
  const byIntent = useMemo(() => {
    const map: Record<string, { intent: string; calls: number; resolved: number }> = {};
    for (const r of filtered) {
      if (!map[r.intent]) map[r.intent] = { intent: r.intent, calls: 0, resolved: 0 };
      map[r.intent].calls++;
      if (r.resolved) map[r.intent].resolved++;
    }
    return Object.values(map).map((x) => ({
      intent: x.intent.length > 15 ? x.intent.substring(0, 15) + "..." : x.intent,
      calls: x.calls,
      resolutionRate: x.calls ? Math.round((x.resolved / x.calls) * 100) : 0,
    }));
  }, [filtered]);

  // Breakdown by location
  const byLocation = useMemo(() => {
    const map: Record<string, { location: string; calls: number; resolved: number }> = {};
    for (const r of filtered) {
      if (!map[r.location]) map[r.location] = { location: r.location, calls: 0, resolved: 0 };
      map[r.location].calls++;
      if (r.resolved) map[r.location].resolved++;
    }
    return Object.values(map).map((x) => ({
      location: x.location,
      calls: x.calls,
      resolutionRate: x.calls ? Math.round((x.resolved / x.calls) * 100) : 0,
    }));
  }, [filtered]);

  // Breakdown by language
  const byLanguage = useMemo(() => {
    const map: Record<string, { language: string; calls: number; resolved: number }> = {};
    for (const r of filtered) {
      if (!map[r.language]) map[r.language] = { language: r.language, calls: 0, resolved: 0 };
      map[r.language].calls++;
      if (r.resolved) map[r.language].resolved++;
    }
    return Object.values(map).map((x) => ({
      language: x.language,
      calls: x.calls,
      resolutionRate: x.calls ? Math.round((x.resolved / x.calls) * 100) : 0,
    }));
  }, [filtered]);

  // Feature adoption
  const featureAdoption = useMemo(() => {
    const languageSwitch = filtered.filter((r) => r.features_used.includes("realtime_language_switch")).length;
    const voiceSynthesis = filtered.filter((r) => r.features_used.includes("voice_synthesis")).length;
    return [
      { name: "Language Switch", value: languageSwitch, color: COLORS.primary },
      { name: "Voice Synthesis", value: voiceSynthesis, color: COLORS.secondary },
      { name: "Not Used", value: Math.max(totalCalls - languageSwitch - voiceSynthesis, 0), color: COLORS.info },
    ];
  }, [filtered, totalCalls]);

  // Download handlers
  const downloadMaster = () => downloadCSV("voxology_master_calls.csv", toCSV(filtered));
  const downloadByDay = () => downloadCSV("calls_by_day.csv", toCSV(byDay));
  const downloadScope = () => downloadCSV("scope_distribution.csv", toCSV(scopeDist));
  const downloadByIntent = () => downloadCSV("resolution_by_intent.csv", toCSV(byIntent));
  const downloadByLocation = () => downloadCSV("breakdown_by_location.csv", toCSV(byLocation));
  const downloadByLanguage = () => downloadCSV("breakdown_by_language.csv", toCSV(byLanguage));
  const downloadFeature = () => downloadCSV("feature_adoption.csv", toCSV(featureAdoption));

  // Filter options
  const locations = useMemo(() => ["All", ...Array.from(new Set(raw.map(r => r.location)))], [raw]);
  const languages = useMemo(() => ["All", ...Array.from(new Set(raw.map(r => r.language)))], [raw]);
  const intents = useMemo(() => ["All", ...Array.from(new Set(raw.map(r => r.intent)))], [raw]);

  const resetFilters = () => {
    setFrom(formatDate(new Date("2024-12-01")));
    setTo(formatDate(new Date("2024-12-31")));
    setLoc("All");
    setLang("All");
    setIntent("All");
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header & Filters */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 1, color: COLORS.primary, fontWeight: 600 }}>
            <Assessment sx={{ mr: 1, verticalAlign: "middle" }} />
            Call Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights into call performance, resolution rates, and feature adoption metrics.
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="From"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                label="To"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Location</InputLabel>
                <Select value={loc} onChange={(e) => setLoc(e.target.value)} label="Location">
                  {locations.map((x) => (
                    <MenuItem key={x} value={x}>{x}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Language</InputLabel>
                <Select value={lang} onChange={(e) => setLang(e.target.value)} label="Language">
                  {languages.map((x) => (
                    <MenuItem key={x} value={x}>{x}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Intent</InputLabel>
                <Select value={intent} onChange={(e) => setIntent(e.target.value)} label="Intent">
                  {intents.map((x) => (
                    <MenuItem key={x} value={x}>{x}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<Refresh />} onClick={resetFilters}>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%", background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.primary}05)` }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUp sx={{ color: COLORS.primary, mr: 1 }} />
                <Typography variant="body2" color="text.secondary">Total Calls</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.primary }}>
                {totalCalls.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%", background: `linear-gradient(135deg, ${COLORS.success}15, ${COLORS.success}05)` }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Psychology sx={{ color: COLORS.success, mr: 1 }} />
                <Typography variant="body2" color="text.secondary">In-Scope Calls</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.success }}>
                {inScope.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%", background: `linear-gradient(135deg, ${COLORS.warning}15, ${COLORS.warning}05)` }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Success Rate</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.warning }}>
                {isFinite(successRate) ? `${successRate}%` : "–"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%", background: `linear-gradient(135deg, ${COLORS.info}15, ${COLORS.info}05)` }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Avg Duration</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.info }}>
                {Math.floor(avgDuration / 60)}:{String(avgDuration % 60).padStart(2, "0")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Time Series Chart */}
        <Grid item xs={12}>
          <ChartSection 
            title="Call Volume Over Time" 
            subtitle="Daily call trends with resolution tracking"
            onDownload={downloadByDay}
          >
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke={COLORS.primary} />
                <YAxis allowDecimals={false} stroke={COLORS.primary} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: 8 
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total Calls" stroke={COLORS.primary} strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="inScope" name="In-Scope" stroke={COLORS.success} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke={COLORS.info} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>

        {/* Scope Distribution */}
        <Grid item xs={12} md={6}>
          <ChartSection 
            title="Scope Distribution" 
            subtitle="In-scope vs out-of-scope calls"
            onDownload={downloadScope}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={scopeDist} 
                  dataKey="value" 
                  nameKey="name" 
                  outerRadius={100} 
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {scopeDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>

        {/* Feature Adoption */}
        <Grid item xs={12} md={6}>
          <ChartSection 
            title="Feature Adoption" 
            subtitle="Usage of advanced AI features"
            onDownload={downloadFeature}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={featureAdoption} 
                  dataKey="value" 
                  nameKey="name" 
                  outerRadius={100} 
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {featureAdoption.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>

        {/* Resolution by Intent */}
        <Grid item xs={12}>
          <ChartSection 
            title="Resolution by Intent" 
            subtitle="Call volume and success rates by intent category"
            onDownload={downloadByIntent}
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={byIntent}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="intent" stroke={COLORS.primary} />
                <YAxis yAxisId="left" orientation="left" allowDecimals={false} stroke={COLORS.primary} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke={COLORS.secondary} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: 8 
                  }} 
                />
                <Legend />
                <Bar yAxisId="left" dataKey="calls" name="Total Calls" fill={COLORS.primary} />
                <Bar yAxisId="right" dataKey="resolutionRate" name="Resolution %" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>

        {/* Location Breakdown */}
        <Grid item xs={12} md={6}>
          <ChartSection 
            title="Performance by Location" 
            subtitle="Call volume and resolution by clinic"
            onDownload={downloadByLocation}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byLocation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="location" stroke={COLORS.primary} />
                <YAxis allowDecimals={false} stroke={COLORS.primary} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: 8 
                  }} 
                />
                <Legend />
                <Bar dataKey="calls" name="Calls" fill={COLORS.teal} />
                <Bar dataKey="resolutionRate" name="Resolution %" fill={COLORS.purple} />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>

        {/* Language Breakdown */}
        <Grid item xs={12} md={6}>
          <ChartSection 
            title="Performance by Language" 
            subtitle="Call volume and resolution by language"
            onDownload={downloadByLanguage}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byLanguage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="language" stroke={COLORS.primary} />
                <YAxis allowDecimals={false} stroke={COLORS.primary} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: 8 
                  }} 
                />
                <Legend />
                <Bar dataKey="calls" name="Calls" fill={COLORS.pink} />
                <Bar dataKey="resolutionRate" name="Resolution %" fill={COLORS.indigo} />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </Grid>
      </Grid>

      {/* Master Export */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
             <Storage sx={{ color: COLORS.primary, fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Master Data Export
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Export the complete filtered dataset of {totalCalls.toLocaleString()} call logs as CSV
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Download />} 
            onClick={downloadMaster}
            sx={{ 
              bgcolor: COLORS.primary,
              "&:hover": { bgcolor: COLORS.primary + "dd" }
            }}
          >
            Download Master CSV
          </Button>
        </Box>
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
        *Sample data shown for demonstration purposes. Replace with live API integration.
      </Typography>
    </Box>
  );
}

// Chart Section Component
function ChartSection({ 
  title, 
  subtitle, 
  children, 
  onDownload 
}: { 
  title: string; 
  subtitle?: string; 
  children: React.ReactNode;
  onDownload: () => void;
}) {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.primary }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<Download />} 
          onClick={onDownload}
          sx={{ 
            borderColor: COLORS.primary,
            color: COLORS.primary,
            "&:hover": { borderColor: COLORS.primary + "dd", bgcolor: COLORS.primary + "08" }
          }}
        >
          Export
        </Button>
      </Box>
      {children}
    </Paper>
  );
} 