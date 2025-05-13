"use client";

import React, { useState, useMemo } from 'react';
import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, Divider } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PieLabelProps {
  name: string;
  percent: number;
}

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface Metrics {
  sentimentScore: number;
  scriptAdherenceScore: number;
  scorecardScore: number;
}

interface AgentData {
  metrics: Metrics;
  sentimentData: DataItem[];
}

interface AgentDataSet {
  [key: string]: AgentData;
}

// Sentiment Analysis Data
const sentimentData = [
  { name: 'Positive', value: 85, color: '#4caf50' },
  { name: 'Neutral', value: 12, color: '#ff9800' },
  { name: 'Negative', value: 3, color: '#f44336' },
];

// Script Adherence Score
const scriptAdherenceScore = 95;

const COLORS = ['#4caf50', '#ff9800', '#f44336'];

const renderCustomizedLabel = ({ name, percent }: PieLabelProps) => {
  return `${name} (${(percent * 100).toFixed(0)}%)`;
};

interface DateRangeMultipliers {
  today: number;
  '7days': number;
  '14days': number;
  '30days': number;
  custom: number;
}

// Date range multipliers
const dateRangeMultipliers: DateRangeMultipliers = {
  'today': 0.85,
  '7days': 0.88,
  '14days': 0.90,
  '30days': 1,
  'custom': 0.92
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {payload[0].name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {payload[0].value}%
        </Typography>
      </Paper>
    );
  }
  return null;
};

// Agent Scorecard Data
const scorecardData = [
  {
    criteria: "Introduce self to the caller",
    points: 5,
    description: "Good afternoon this is (name), how may I assist you?"
  },
  {
    criteria: "Collect Demographic information",
    points: 5,
    description: "Verify DOB, address, phone number, PCP (at least 2 verifiers)"
  },
  {
    criteria: "Assess reason for call",
    points: 10,
    description: "Reason for call obtain information. If patient is symptomatic, obtain a brief history, assess symptoms. Ask about health problems, medications, and recent visits/hospitalization. Focus on the issue that will affect the call outcome (eliminate this step is life threatening or serious)."
  },
  {
    criteria: "Identify the reason for the call",
    points: 10,
    description: "Encourage the caller to answer all questions needed for adequate information. Use \"open ended\" questions: \"Please tell me about\""
  },
  {
    criteria: "Instructions given",
    points: 15,
    description: "Instructions on expected time frame of response"
  },
  {
    criteria: "Select the correct protocol and PM group/MD",
    points: 10,
    description: "Who to send it to, and how to address it"
  },
  {
    criteria: "Select the appropriate disposition",
    points: 15,
    description: "Stop asking questions as soon as you elicit a positive answer – presence is an indicator to be seen. Choose the disposition associated with the question."
  },
  {
    criteria: "Verify understanding – use teach back method",
    points: 15,
    description: "After providing care advice, allow the patient the opportunity to fill in missing pieces by asking \"What other questions do you have about what we discussed?\" \" Is there anything I did not address today?\" The teach back method allows the patient to repeat back the care advice instructions in their own words. If the advice is lengthy, break the advice into \"chunks\" and use the teach back method after each \"chunk\""
  },
  {
    criteria: "Give callback instructions",
    points: 5,
    description: "404-845-8200"
  },
  {
    criteria: "Document call in Cerner",
    points: 10,
    description: "Details of call should be documented, including symptoms, severity, disposition, and outcome of call"
  }
];

const totalPossiblePoints = scorecardData.reduce((sum, item) => sum + item.points, 0);
const currentScore = 95;

// Quality data for different categories
const qualityData: QualityData = {
  default: {
    metrics: {
      sentimentScore: 0,
      scriptAdherenceScore: 95,
      scorecardScore: 95
    },
    sentimentData: [
      { name: 'Positive', value: 85, color: '#4caf50' },
      { name: 'Neutral', value: 12, color: '#ff9800' },
      { name: 'Negative', value: 3, color: '#f44336' },
    ]
  },
  appointments: {
    metrics: {
      sentimentScore: 0,
      scriptAdherenceScore: 96,
      scorecardScore: 96
    },
    sentimentData: [
      { name: 'Positive', value: 88, color: '#4caf50' },
      { name: 'Neutral', value: 10, color: '#ff9800' },
      { name: 'Negative', value: 2, color: '#f44336' },
    ]
  },
  prescriptions: {
    metrics: {
      sentimentScore: 0,
      scriptAdherenceScore: 94,
      scorecardScore: 94
    },
    sentimentData: [
      { name: 'Positive', value: 82, color: '#4caf50' },
      { name: 'Neutral', value: 15, color: '#ff9800' },
      { name: 'Negative', value: 3, color: '#f44336' },
    ]
  },
  general: {
    metrics: {
      sentimentScore: 0,
      scriptAdherenceScore: 92,
      scorecardScore: 92
    },
    sentimentData: [
      { name: 'Positive', value: 80, color: '#4caf50' },
      { name: 'Neutral', value: 18, color: '#ff9800' },
      { name: 'Negative', value: 2, color: '#f44336' },
    ]
  }
};

// Agent-specific data
const agentData: AgentDataSet = {
  'agent1': {
    metrics: {
      sentimentScore: 0,
      scriptAdherenceScore: 98,
      scorecardScore: 98
    },
    sentimentData: [
      { name: 'Positive', value: 88, color: '#4caf50' },
      { name: 'Neutral', value: 10, color: '#ff9800' },
      { name: 'Negative', value: 2, color: '#f44336' },
    ]
  },
  'agent2': {
    metrics: {
      sentimentScore: 0,
      scriptAdherenceScore: 92,
      scorecardScore: 92
    },
    sentimentData: [
      { name: 'Positive', value: 85, color: '#4caf50' },
      { name: 'Neutral', value: 12, color: '#ff9800' },
      { name: 'Negative', value: 3, color: '#f44336' },
    ]
  },
  'agent3': {
    metrics: {
      sentimentScore: 0,
      scriptAdherenceScore: 95,
      scorecardScore: 95
    },
    sentimentData: [
      { name: 'Positive', value: 90, color: '#4caf50' },
      { name: 'Neutral', value: 8, color: '#ff9800' },
      { name: 'Negative', value: 2, color: '#f44336' },
    ]
  }
};

type CategoryName = 'appointments' | 'prescriptions' | 'general' | 'default' | 'total';

interface QualityData {
  default: AgentData;
  appointments: AgentData;
  prescriptions: AgentData;
  general: AgentData;
  [key: string]: AgentData;
}

export default function QualityAnalytics() {
  const [dateRange, setDateRange] = useState('today');
  const [category, setCategory] = useState<CategoryName>('total');
  const [agent, setAgent] = useState('total');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Get the current data based on filters
  const currentData = useMemo(() => {
    if (agent === 'total') {
      // Calculate aggregated data across all agents
      const totalData: AgentData = {
        metrics: {
          sentimentScore: 0,
          scriptAdherenceScore: 0,
          scorecardScore: 0
        },
        sentimentData: []
      };

      // Calculate average scores
      let totalSentimentScore = 0;
      let totalScriptAdherenceScore = 0;
      let totalScorecardScore = 0;
      const agentCount = Object.keys(agentData).length;

      Object.values(agentData).forEach(agent => {
        totalSentimentScore += agent.metrics.sentimentScore;
        totalScriptAdherenceScore += agent.metrics.scriptAdherenceScore;
        totalScorecardScore += agent.metrics.scorecardScore;
      });

      totalData.metrics.sentimentScore = Math.round(totalSentimentScore / agentCount);
      totalData.metrics.scriptAdherenceScore = Math.round(totalScriptAdherenceScore / agentCount);
      totalData.metrics.scorecardScore = Math.round(totalScorecardScore / agentCount);

      // Aggregate sentiment data
      const sentimentMap = new Map();
      Object.values(agentData).forEach(agent => {
        agent.sentimentData.forEach(item => {
          const existing = sentimentMap.get(item.name);
          if (existing) {
            sentimentMap.set(item.name, existing + item.value);
          } else {
            sentimentMap.set(item.name, item.value);
          }
        });
      });

      totalData.sentimentData = Array.from(sentimentMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round(value / agentCount),
        color: agentData['agent1'].sentimentData.find(item => item.name === name)?.color || '#000000'
      }));

      return totalData;
    }

    if (category === 'total') {
      // Calculate aggregated data across all categories
      const totalData: AgentData = {
        metrics: {
          sentimentScore: 0,
          scriptAdherenceScore: 0,
          scorecardScore: 0
        },
        sentimentData: []
      };

      // Calculate average scores across categories
      let totalSentimentScore = 0;
      let totalScriptAdherenceScore = 0;
      let totalScorecardScore = 0;
      const categoryCount = 3; // appointments, prescriptions, general

      ['appointments', 'prescriptions', 'general'].forEach(cat => {
        const catData = qualityData[cat as CategoryName];
        totalSentimentScore += catData.metrics.sentimentScore;
        totalScriptAdherenceScore += catData.metrics.scriptAdherenceScore;
        totalScorecardScore += catData.metrics.scorecardScore;
      });

      totalData.metrics.sentimentScore = Math.round(totalSentimentScore / categoryCount);
      totalData.metrics.scriptAdherenceScore = Math.round(totalScriptAdherenceScore / categoryCount);
      totalData.metrics.scorecardScore = Math.round(totalScorecardScore / categoryCount);

      // Aggregate sentiment data
      const sentimentMap = new Map();
      ['appointments', 'prescriptions', 'general'].forEach(cat => {
        const catData = qualityData[cat as CategoryName];
        catData.sentimentData.forEach(item => {
          const existing = sentimentMap.get(item.name);
          if (existing) {
            sentimentMap.set(item.name, existing + item.value);
          } else {
            sentimentMap.set(item.name, item.value);
          }
        });
      });

      totalData.sentimentData = Array.from(sentimentMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round(value / categoryCount),
        color: qualityData.appointments.sentimentData.find(item => item.name === name)?.color || '#000000'
      }));

      return totalData;
    }
    
    return agentData[agent] || qualityData[category];
  }, [category, agent]);

  const handleDateRangeChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomRangeOpen(true);
    } else {
      setDateRange(value);
    }
  };

  const handleCustomRangeSubmit = () => {
    setDateRange(`${customStartDate} - ${customEndDate}`);
    setIsCustomRangeOpen(false);
  };

  return (
    <Box>
      {/* Filters Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => handleDateRangeChange(e.target.value)}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="14days">Last 2 Weeks</MenuItem>
                <MenuItem value="30days">Last Month</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value as CategoryName)}
              >
                <MenuItem value="total">Total</MenuItem>
                <MenuItem value="appointments">Appointments</MenuItem>
                <MenuItem value="prescriptions">Prescriptions</MenuItem>
                <MenuItem value="general">General</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Agent</InputLabel>
              <Select
                value={agent}
                label="Agent"
                onChange={(e) => setAgent(e.target.value)}
              >
                <MenuItem value="total">Total</MenuItem>
                <MenuItem value="agent1">Robert</MenuItem>
                <MenuItem value="agent2">Mia</MenuItem>
                <MenuItem value="agent3">Daniel</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Custom Date Range Dialog */}
      <Dialog open={isCustomRangeOpen} onClose={() => setIsCustomRangeOpen(false)}>
        <DialogTitle>Select Custom Date Range</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: '300px' }}>
            <TextField
              label="Start Date"
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCustomRangeOpen(false)}>Cancel</Button>
          <Button onClick={handleCustomRangeSubmit} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Sentiment Analysis and Script Adherence Score Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sentiment Analysis Pie Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Sentiment Analysis
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <PieChart width={300} height={350}>
              <Pie
                data={currentData.sentimentData}
                cx={150}
                cy={120}
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {currentData.sentimentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: '20px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                formatter={(value: string) => (
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {value}
                  </Typography>
                )}
              />
            </PieChart>
          </Paper>
        </Grid>

        {/* Script Adherence Score */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Script Adherence Score
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary" gutterBottom>
                {currentData.metrics.scriptAdherenceScore}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Overall Script Adherence Score
              </Typography>
              <Box sx={{ mt: 4, px: 4 }}>
                <LinearProgress
                  variant="determinate"
                  value={currentData.metrics.scriptAdherenceScore}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#4caf50',
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Agent Scorecard */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Script Adherence Details
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">
                Total Score: {currentData.metrics.scorecardScore}/{totalPossiblePoints}
              </Typography>
              <Box sx={{ width: '200px' }}>
                <LinearProgress
                  variant="determinate"
                  value={(currentData.metrics.scorecardScore / totalPossiblePoints) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#4caf50',
                    },
                  }}
                />
              </Box>
            </Box>
            <List>
              {scorecardData.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.criteria}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        {item.points} points
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                      {item.description}
                    </Typography>
                  </ListItem>
                  {index < scorecardData.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 