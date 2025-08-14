"use client";

import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

export default function AgentInsights() {
  const [dateRange, setDateRange] = useState('today');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Base data for different time periods
  const baseData = {
    today: {
      topPerformers: [
        { name: 'Jenny Smith', value: 95, metric: 'Call Resolution Rate' },
        { name: 'David Lee', value: 92, metric: 'Empathy Score' },
        { name: 'Sarah Johnson', value: 90, metric: 'Script Adherence' },
      ],
      laggards: [
        { name: 'Michael Brown', value: 65, metric: 'Sentiment Score' },
        { name: 'Emily Davis', value: 70, metric: 'Escalation Rate' },
        { name: 'James Wilson', value: 68, metric: 'Call Quality' },
      ]
    },
    week: {
      topPerformers: [
        { name: 'Jenny Smith', value: 92, metric: 'Call Resolution Rate' },
        { name: 'David Lee', value: 89, metric: 'Empathy Score' },
        { name: 'Sarah Johnson', value: 87, metric: 'Script Adherence' },
      ],
      laggards: [
        { name: 'Michael Brown', value: 62, metric: 'Sentiment Score' },
        { name: 'Emily Davis', value: 67, metric: 'Escalation Rate' },
        { name: 'James Wilson', value: 65, metric: 'Call Quality' },
      ]
    },
    month: {
      topPerformers: [
        { name: 'Jenny Smith', value: 88, metric: 'Call Resolution Rate' },
        { name: 'David Lee', value: 85, metric: 'Empathy Score' },
        { name: 'Sarah Johnson', value: 83, metric: 'Script Adherence' },
      ],
      laggards: [
        { name: 'Michael Brown', value: 58, metric: 'Sentiment Score' },
        { name: 'Emily Davis', value: 63, metric: 'Escalation Rate' },
        { name: 'James Wilson', value: 61, metric: 'Call Quality' },
      ]
    },
    custom: {
      topPerformers: [
        { name: 'Jenny Smith', value: 90, metric: 'Call Resolution Rate' },
        { name: 'David Lee', value: 87, metric: 'Empathy Score' },
        { name: 'Sarah Johnson', value: 85, metric: 'Script Adherence' },
      ],
      laggards: [
        { name: 'Michael Brown', value: 60, metric: 'Sentiment Score' },
        { name: 'Emily Davis', value: 65, metric: 'Escalation Rate' },
        { name: 'James Wilson', value: 63, metric: 'Call Quality' },
      ]
    }
  };

  // Calculate current data based on date range
  const currentData = useMemo(() => {
    return baseData[dateRange as keyof typeof baseData];
  }, [dateRange, baseData]);

  // Criteria Data
  const criteriaData = [
    {
      name: 'Script Adherence',
      description: 'Following call scripts and protocols accurately'
    },
    {
      name: 'Resolution Rate',
      description: 'Successfully resolving customer issues on first contact'
    },
    {
      name: 'Escalation Rate',
      description: 'Minimizing need for supervisor intervention'
    },
    {
      name: 'Sentiment Analysis',
      description: 'Maintaining positive customer sentiment throughout calls'
    }
  ];

  const TOP_PERFORMER_COLORS = ['#1976d2', '#2196f3', '#64b5f6'];
  const LAGGARD_COLORS = ['#f57c00', '#ff9800', '#ffb74d'];

  const CustomTooltip = ({ active, payload }: any) => {
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
          <Typography variant="body2" color="text.secondary">
            {payload[0].payload.metric}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const handleCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom');
      setIsCustomRangeOpen(false);
    }
  };

  return (
    <Box>
      {/* Filters Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomRangeOpen(true);
                  } else {
                    setDateRange(e.target.value);
                  }
                }}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Custom Date Range Dialog */}
      <Dialog open={isCustomRangeOpen} onClose={() => setIsCustomRangeOpen(false)}>
        <DialogTitle>Select Custom Date Range</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2, minWidth: '300px' }}>
            <TextField
              label="Start Date"
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCustomRangeOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCustomDateRange}
            variant="contained"
            disabled={!customStartDate || !customEndDate}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'stretch',
          gap: 4
        }}>
          {/* Top Performers */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h6" gutterBottom align="center">
              Top Performers
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}>
              <PieChart width={200} height={200}>
                <Pie
                  data={currentData.topPerformers}
                  cx={100}
                  cy={100}
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {currentData.topPerformers.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={TOP_PERFORMER_COLORS[index % TOP_PERFORMER_COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
              <Stack spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
                {currentData.topPerformers.map((entry, index) => (
                  <Box key={entry.name} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    justifyContent: 'flex-start'
                  }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: TOP_PERFORMER_COLORS[index % TOP_PERFORMER_COLORS.length],
                        flexShrink: 0
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {entry.name} ({entry.value}%)
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* Vertical Divider */}
          <Box sx={{ 
            width: '1px',
            backgroundColor: 'divider',
            my: 2
          }} />

          {/* Laggards */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h6" gutterBottom align="center">
              Laggards
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}>
              <PieChart width={200} height={200}>
                <Pie
                  data={currentData.laggards}
                  cx={100}
                  cy={100}
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {currentData.laggards.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={LAGGARD_COLORS[index % LAGGARD_COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
              <Stack spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
                {currentData.laggards.map((entry, index) => (
                  <Box key={entry.name} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    justifyContent: 'flex-start'
                  }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: LAGGARD_COLORS[index % LAGGARD_COLORS.length],
                        flexShrink: 0
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {entry.name} ({entry.value}%)
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Criteria Section */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Performance Criteria
          </Typography>
          <Grid container spacing={2}>
            {criteriaData.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
} 