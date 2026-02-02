import { useState } from 'react';
import { AppLayout } from '@/components/app/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useGPSIntegrations, useCreateGPSIntegration, useUpdateGPSIntegration, useDeleteGPSIntegration, GPSIntegration } from '@/hooks/useGPSIntegrations';
import { Settings as SettingsIcon, Plus, Trash2, Edit2, MapPin, Eye, EyeOff, Loader2, ExternalLink } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const PROVIDER_PRESETS = [
  { name: 'Flespi', url: 'https://flespi.io/gw', docs: 'https://flespi.com/kb' },
  { name: 'Traccar', url: 'https://demo.traccar.org/api', docs: 'https://www.traccar.org/api-reference/' },
  { name: 'Wialon', url: 'https://hst-api.wialon.com/wialon/ajax.html', docs: 'https://sdk.wialon.com/' },
  { name: 'Custom', url: '', docs: '' },
];

const Settings = () => {
  const { toast } = useToast();
  const { data: integrations, isLoading } = useGPSIntegrations();
  const createIntegration = useCreateGPSIntegration();
  const updateIntegration = useUpdateGPSIntegration();
  const deleteIntegration = useDeleteGPSIntegration();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<GPSIntegration | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    provider_name: '',
    api_url: '',
    api_key: '',
    api_secret: '',
  });

  const handlePresetSelect = (preset: typeof PROVIDER_PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      provider_name: preset.name === 'Custom' ? '' : preset.name,
      api_url: preset.url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedIntegration) {
        await updateIntegration.mutateAsync({
          id: selectedIntegration.id,
          ...formData,
        });
        toast({ title: 'Integration updated successfully' });
      } else {
        await createIntegration.mutateAsync(formData);
        toast({ title: 'Integration added successfully' });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (integration: GPSIntegration) => {
    setSelectedIntegration(integration);
    setFormData({
      provider_name: integration.provider_name,
      api_url: integration.api_url,
      api_key: integration.api_key,
      api_secret: integration.api_secret || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedIntegration) return;
    
    try {
      await deleteIntegration.mutateAsync(selectedIntegration.id);
      toast({ title: 'Integration deleted' });
      setDeleteDialogOpen(false);
      setSelectedIntegration(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (integration: GPSIntegration) => {
    try {
      await updateIntegration.mutateAsync({
        id: integration.id,
        is_active: !integration.is_active,
      });
      toast({ title: integration.is_active ? 'Integration disabled' : 'Integration enabled' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({ provider_name: '', api_url: '', api_key: '', api_secret: '' });
    setSelectedIntegration(null);
  };

  const toggleShowApiKey = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <SettingsIcon className="w-8 h-8" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage your integrations and company settings</p>
          </div>
        </div>

        {/* GPS Integrations Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                GPS Tracking Integrations
              </CardTitle>
              <CardDescription>
                Connect your GPS tracking providers to get real-time vehicle locations
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{selectedIntegration ? 'Edit' : 'Add'} GPS Provider</DialogTitle>
                  <DialogDescription>
                    Enter your tracking provider API credentials
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Provider Presets */}
                  <div className="space-y-2">
                    <Label>Quick Select Provider</Label>
                    <div className="flex flex-wrap gap-2">
                      {PROVIDER_PRESETS.map((preset) => (
                        <Button
                          key={preset.name}
                          type="button"
                          variant={formData.provider_name === preset.name ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePresetSelect(preset)}
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider_name">Provider Name *</Label>
                    <Input
                      id="provider_name"
                      value={formData.provider_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, provider_name: e.target.value }))}
                      placeholder="e.g., Flespi, Traccar, Custom Provider"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api_url">API URL *</Label>
                    <Input
                      id="api_url"
                      value={formData.api_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, api_url: e.target.value }))}
                      placeholder="https://api.provider.com/v1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api_key">API Key *</Label>
                    <Input
                      id="api_key"
                      type="password"
                      value={formData.api_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                      placeholder="Your API key"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api_secret">API Secret (optional)</Label>
                    <Input
                      id="api_secret"
                      type="password"
                      value={formData.api_secret}
                      onChange={(e) => setFormData(prev => ({ ...prev, api_secret: e.target.value }))}
                      placeholder="If required by your provider"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createIntegration.isPending || updateIntegration.isPending}>
                      {(createIntegration.isPending || updateIntegration.isPending) && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {selectedIntegration ? 'Update' : 'Add'} Integration
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : integrations && integrations.length > 0 ? (
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{integration.provider_name}</h3>
                          <Badge variant={integration.is_active ? 'default' : 'secondary'}>
                            {integration.is_active ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{integration.api_url}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">API Key:</span>
                          <code className="text-xs bg-muted px-1 rounded">
                            {showApiKey[integration.id] 
                              ? integration.api_key 
                              : '••••••••••••'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={() => toggleShowApiKey(integration.id)}
                          >
                            {showApiKey[integration.id] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={integration.is_active}
                        onCheckedChange={() => handleToggleActive(integration)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(integration)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedIntegration(integration);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No GPS integrations configured</p>
                <p className="text-sm">Add your first tracking provider to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Resources for setting up your GPS integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {PROVIDER_PRESETS.filter(p => p.docs).map((provider) => (
                <a
                  key={provider.name}
                  href={provider.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>{provider.name} Documentation</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Integration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {selectedIntegration?.provider_name} integration?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Settings;
