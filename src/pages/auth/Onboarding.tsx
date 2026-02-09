import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, Truck } from 'lucide-react';

const Onboarding = () => {
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dual currency is always USD + ZWG
  const currency = 'USD';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          owner_name: ownerName,
          email: user.email,
          phone,
          currency, // Primary currency USD, system supports dual USD/ZWG
        })
        .select()
        .single();

      if (companyError) throw companyError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_id: company.id, full_name: ownerName, phone })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'owner' });

      if (roleError) throw roleError;

      await refreshProfile();

      toast({ title: 'Company created!', description: 'Your company has been set up with dual currency (USD + ZWG).' });
      navigate('/app/dashboard');
    } catch (error: any) {
      toast({ title: 'Setup failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-accent" />
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl">Set up your company</CardTitle>
          <CardDescription>Let's get your fleet management system ready</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" type="text" placeholder="ABC Logistics" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner / Manager Name</Label>
              <Input id="ownerName" type="text" placeholder="John Doe" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+263 77 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <span className="font-semibold">USD</span>
                </div>
                <span className="text-muted-foreground">+</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇿🇼</span>
                  <span className="font-semibold">ZWG</span>
                </div>
                <span className="text-xs text-muted-foreground ml-auto">Dual Currency</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your system supports both US Dollar and Zimbabwe Gold (ZWG). You can record transactions in either currency.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Setting up...</>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
