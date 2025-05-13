"use client";

import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider } from "@mui/material";
import { useState, useMemo } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

type CategoryName = 'appointments' | 'prescriptions' | 'general' | 'default' | 'total';

interface ComplianceData {
  hippaScore: number;
}

interface ComplianceDataSet {
  default: ComplianceData;
  appointments: ComplianceData;
  prescriptions: ComplianceData;
  general: ComplianceData;
  [key: string]: ComplianceData;
}

interface AgentData {
  hippaScore: number;
}

interface AgentDataSet {
  [key: string]: AgentData;
}

// Agent-specific data
const agentData: AgentDataSet = {
  'agent1': {
    hippaScore: 97
  },
  'agent2': {
    hippaScore: 95
  },
  'agent3': {
    hippaScore: 96
  }
};

// Compliance data for different categories
const complianceData: ComplianceDataSet = {
  default: {
    hippaScore: 95
  },
  appointments: {
    hippaScore: 98
  },
  prescriptions: {
    hippaScore: 96
  },
  general: {
    hippaScore: 94
  }
};

// Date range multipliers
const dateRangeMultipliers = {
  'today': 0.85,
  '7days': 0.88,
  '14days': 0.90,
  '30days': 1,
  'custom': 0.92
};

export default function ComplianceAnalytics() {
  const [dateRange, setDateRange] = useState('today');
  const [category, setCategory] = useState<CategoryName>('total');
  const [agent, setAgent] = useState('total');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

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

  // Get the current data based on filters
  const currentData = useMemo(() => {
    if (agent === 'total') {
      // Calculate aggregated data across all agents
      const totalData: AgentData = {
        hippaScore: 0
      };

      // Calculate average HIPAA score
      let totalHippaScore = 0;
      const agentCount = Object.keys(agentData).length;

      Object.values(agentData).forEach(agent => {
        totalHippaScore += agent.hippaScore;
      });

      totalData.hippaScore = Math.round(totalHippaScore / agentCount);

      return totalData;
    }

    if (category === 'total') {
      // Calculate aggregated data across all categories
      const totalData: AgentData = {
        hippaScore: 0
      };

      // Calculate average HIPAA score across categories
      let totalHippaScore = 0;
      const categoryCount = 3; // appointments, prescriptions, general

      ['appointments', 'prescriptions', 'general'].forEach(cat => {
        const catData = complianceData[cat as CategoryName];
        totalHippaScore += catData.hippaScore;
      });

      totalData.hippaScore = Math.round(totalHippaScore / categoryCount);

      return totalData;
    }
    
    return agentData[agent] || complianceData[category];
  }, [category, agent]);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Typography variant="h5" gutterBottom>
          HIPAA Compliance Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Monitor and analyze HIPAA compliance metrics across your team
        </Typography>

        <Divider sx={{ my: 3 }} />

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

        <Divider sx={{ my: 3 }} />

        {/* Score Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Compliance Score
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" color="primary" gutterBottom>
              {currentData.hippaScore}%
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Overall Compliance Score
            </Typography>
            <Box sx={{ mt: 3, px: 4 }}>
              <LinearProgress
                variant="determinate"
                value={currentData.hippaScore}
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
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Compliance Criteria Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Compliance Criteria
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body1" paragraph>
                  • PHI mentioned only when appropriate
                </Typography>
                <Typography variant="body1" paragraph>
                  • No unauthorized disclosures
                </Typography>
                <Typography variant="body1" paragraph>
                  • Proper verification procedures followed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body1" paragraph>
                  • Secure handling of patient information
                </Typography>
                <Typography variant="body1" paragraph>
                  • Compliance with privacy regulations
                </Typography>
                <Typography variant="body1" paragraph>
                  • Regular compliance training completed
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

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
    </Box>
  );
} 