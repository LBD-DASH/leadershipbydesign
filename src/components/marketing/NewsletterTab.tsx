import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CSVUploader from './CSVUploader';
import NewsletterComposer from './NewsletterComposer';
import NewsletterHistory from './NewsletterHistory';
import SubscriberManager from './SubscriberManager';
import { Upload, PenTool, History, Users } from 'lucide-react';

export default function NewsletterTab() {
  const [subTab, setSubTab] = useState('compose');

  return (
    <div className="space-y-6">
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="compose" className="gap-2">
            <PenTool className="w-4 h-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Users className="w-4 h-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <NewsletterComposer />
        </TabsContent>
        <TabsContent value="contacts">
          <SubscriberManager />
        </TabsContent>
        <TabsContent value="upload">
          <CSVUploader onImportComplete={() => setSubTab('contacts')} />
        </TabsContent>
        <TabsContent value="history">
          <NewsletterHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
