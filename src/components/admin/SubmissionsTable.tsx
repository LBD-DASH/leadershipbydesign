import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Mail, Building, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface SubmissionsTableProps {
  title: string;
  submissions: Array<{
    id: string;
    created_at: string;
    email?: string | null;
    name?: string | null;
    organisation?: string | null;
    role?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    follow_up_preference?: string | null;
    waiting_list?: boolean | null;
    primary_level?: string;
    primary_recommendation?: string;
    primary_development?: string;
    primary_strength?: string;
  }>;
  type: 'leadership' | 'team' | 'shift';
  isLoading: boolean;
}

const getResultLabel = (sub: SubmissionsTableProps['submissions'][0], type: SubmissionsTableProps['type']) => {
  if (type === 'leadership') return sub.primary_level || '-';
  if (type === 'team') return sub.primary_recommendation || '-';
  if (type === 'shift') return sub.primary_development ? `Dev: ${sub.primary_development}` : '-';
  return '-';
};

export default function SubmissionsTable({ title, submissions, type, isLoading }: SubmissionsTableProps) {
  const [search, setSearch] = useState('');

  const filteredSubmissions = submissions.filter(sub => {
    const searchLower = search.toLowerCase();
    return (
      (sub.email?.toLowerCase().includes(searchLower)) ||
      (sub.name?.toLowerCase().includes(searchLower)) ||
      (sub.organisation?.toLowerCase().includes(searchLower)) ||
      (sub.utm_source?.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>
              {submissions.length} total submissions
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>UTM Source</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(sub.created_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{sub.name || 'Anonymous'}</span>
                          {sub.email && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {sub.email}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {sub.organisation ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Building className="w-3 h-3 text-muted-foreground" />
                            {sub.organisation}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getResultLabel(sub, type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sub.utm_source ? (
                          <div className="text-sm">
                            <span className="font-medium">{sub.utm_source}</span>
                            {sub.utm_medium && (
                              <span className="text-muted-foreground"> / {sub.utm_medium}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Direct</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {sub.email && (
                            <Badge variant="default" className="text-xs">Lead</Badge>
                          )}
                          {sub.waiting_list && (
                            <Badge variant="secondary" className="text-xs">Waiting List</Badge>
                          )}
                          {sub.follow_up_preference === 'yes' && (
                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600">Contact</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {search ? 'No matching submissions found' : 'No submissions yet'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
