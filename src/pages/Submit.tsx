import React, { useState } from 'react';
import { Send, Eye, Loader } from 'lucide-react';
import TakeCard from '../components/TakeCard';
import type { Take } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwtRJahrxeCKST1UvJApQsrU64O7YldyF2Y90farN6fGNOPzOUwHbhzJ4fnmvjOR2Juw/exec';

export default function Submit() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    media: '',
    description: '',
    url: '',
    outlet: '',
    date: '',
    category: 'Price Prediction'
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataWithTimestamp = {
        ...formData,
        timestamp: new Date().toISOString()
      };

      await fetch(SHEET_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithTimestamp)
      });

      toast({
        title: "Success!",
        description: "Your submission has been received. It will be reviewed and added to the site soon.",
        duration: 5000,
      });

      setFormData({
        headline: '',
        media: '',
        description: '',
        url: '',
        outlet: '',
        date: '',
        category: 'Price Prediction'
      });
      setShowPreview(false);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again later.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewTake: Take = {
    id: 'preview',
    headline: formData.headline,
    media: formData.media,
    description: formData.description,
    url: formData.url,
    outlet: formData.outlet,
    date: formData.date,
    category: formData.category,
    votes: 0,
    slug: '',
    bitcoinPrice: 0
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <header className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-4">
          <Send className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-500">
            Submit a Take
          </h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto px-4">
          Found a catastrophically wrong Bitcoin take? Submit it for the hall of shame.
        </p>
      </header>

      <Card className="max-w-2xl mx-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Headline/Quote
            </label>
            <input
              type="text"
              required
              value={formData.headline}
              onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="The exact quote of the bad take"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Media URL
            </label>
            <input
              type="url"
              value={formData.media}
              onChange={(e) => setFormData(prev => ({ ...prev, media: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="URL to screenshot or video (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description/Context
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              placeholder="Brief context about when and where this was said"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source URL
              </label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Link to the original source"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Outlet/Platform
              </label>
              <input
                type="text"
                required
                value={formData.outlet}
                onChange={(e) => setFormData(prev => ({ ...prev, outlet: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., CNBC, Twitter, Bloomberg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Price Prediction">Price Prediction</option>
                <option value="Energy FUD">Energy FUD</option>
                <option value="Death Spiral">Death Spiral</option>
                <option value="Regulation">Regulation</option>
                <option value="Technology">Technology</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="order-2 sm:order-1"
            >
              <Eye className="h-5 w-5 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="order-1 sm:order-2"
            >
              {isSubmitting ? (
                <Loader className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Send className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Take'}
            </Button>
          </div>
        </form>

        {showPreview && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl font-bold text-orange-500 mb-6">Preview</h2>
            <TakeCard take={previewTake} />
          </div>
        )}
      </Card>
    </div>
  );
}