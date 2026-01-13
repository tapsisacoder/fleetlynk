import { useState } from 'react';
import { AppLayout } from '@/components/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useInvoices, useExpenses, useTransactions } from '@/hooks/useAccounting';
import { useTrips } from '@/hooks/useTrips';
import { useVehicles } from '@/hooks/useVehicles';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Truck, 
  MapPin, 
  Fuel,
  FileText,
  Download
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Reports = () => {
  const [dateRange, setDateRange] = useState('30');
  
  const { data: invoices } = useInvoices();
  const { data: expenses } = useExpenses();
  const { data: transactions } = useTransactions();
  const { data: trips } = useTrips();
  const { data: vehicles } = useVehicles();

  // Calculate date range
  const endDate = new Date();
  const startDate = subDays(endDate, parseInt(dateRange));

  // Filter data by date range
  const filteredInvoices = invoices?.filter(i => new Date(i.invoice_date) >= startDate) || [];
  const filteredExpenses = expenses?.filter(e => new Date(e.expense_date) >= startDate) || [];
  const filteredTrips = trips?.filter(t => new Date(t.created_at || '') >= startDate) || [];

  // Calculate stats
  const totalRevenue = filteredInvoices.reduce((sum, i) => sum + i.total_amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  const completedTrips = filteredTrips.filter(t => t.status === 'completed').length;
  const activeTrips = filteredTrips.filter(t => t.status === 'in_transit').length;

  // Revenue by week chart data
  const revenueByWeek = Array.from({ length: 4 }, (_, i) => {
    const weekEnd = subDays(endDate, i * 7);
    const weekStart = subDays(weekEnd, 7);
    const weekInvoices = filteredInvoices.filter(inv => {
      const invDate = new Date(inv.invoice_date);
      return invDate >= weekStart && invDate < weekEnd;
    });
    return {
      week: `Week ${4 - i}`,
      revenue: weekInvoices.reduce((sum, i) => sum + i.total_amount, 0),
      expenses: filteredExpenses.filter(exp => {
        const expDate = new Date(exp.expense_date);
        return expDate >= weekStart && expDate < weekEnd;
      }).reduce((sum, e) => sum + e.amount, 0)
    };
  }).reverse();

  // Expenses by category
  const expensesByCategory = EXPENSE_CATEGORIES.map(cat => ({
    name: cat,
    value: filteredExpenses
      .filter(e => e.expense_type === cat)
      .reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.value > 0);

  // Vehicle utilization
  const vehicleUtilization = vehicles?.map(v => {
    const vehicleTrips = filteredTrips.filter(t => t.vehicle_id === v.id);
    const totalDistance = vehicleTrips.reduce((sum, t) => sum + (t.distance_km || 0), 0);
    return {
      vehicle: v.registration_number,
      trips: vehicleTrips.length,
      distance: totalDistance,
      revenue: filteredInvoices.filter(i => 
        vehicleTrips.some(t => t.id === i.trip_id)
      ).reduce((sum, i) => sum + i.total_amount, 0)
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5) || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Financial and operational analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {filteredInvoices.length} invoices
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {filteredExpenses.length} records
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profitMargin.toFixed(1)}% margin
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {netProfit >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Trips</p>
                  <p className="text-2xl font-bold">{completedTrips + activeTrips}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{completedTrips} completed</Badge>
                    <Badge variant="outline" className="text-xs text-green-600">{activeTrips} active</Badge>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue vs Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByWeek}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                  <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No expense data for selected period
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicleUtilization.length > 0 ? (
              <div className="space-y-4">
                {vehicleUtilization.map((v, i) => (
                  <div key={v.vehicle} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{v.vehicle}</span>
                        <span className="text-sm text-muted-foreground">
                          {v.trips} trips • {v.distance.toLocaleString()} km
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(v.revenue / (vehicleUtilization[0]?.revenue || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">${v.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No vehicle data for selected period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Draft</span>
                <span className="font-semibold">{filteredInvoices.filter(i => i.status === 'draft').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sent</span>
                <span className="font-semibold">{filteredInvoices.filter(i => i.status === 'sent').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-semibold text-green-600">{filteredInvoices.filter(i => i.status === 'paid').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overdue</span>
                <span className="font-semibold text-red-600">{filteredInvoices.filter(i => i.status === 'overdue').length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fleet Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Vehicles</span>
                <span className="font-semibold">{vehicles?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available</span>
                <span className="font-semibold text-green-600">{vehicles?.filter(v => v.status === 'available').length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deployed</span>
                <span className="font-semibold text-blue-600">{vehicles?.filter(v => v.status === 'deployed').length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maintenance</span>
                <span className="font-semibold text-amber-600">{vehicles?.filter(v => v.status === 'maintenance').length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Expense Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {expensesByCategory.slice(0, 4).map((cat, i) => (
                <div key={cat.name} className="flex justify-between">
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="font-semibold">${cat.value.toLocaleString()}</span>
                </div>
              ))}
              {expensesByCategory.length === 0 && (
                <p className="text-muted-foreground text-sm">No expenses in period</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

const EXPENSE_CATEGORIES = [
  'Fuel',
  'Toll Fees',
  'Border Fees',
  'Maintenance',
  'Tyres',
  'Driver Allowance',
  'Accommodation',
  'Airtime',
  'Fines',
  'Insurance',
  'Licensing',
  'Other'
];

export default Reports;
