import type { Subscription, Team, User } from '@aicostguard/shared';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { toApiClientError } from '../../shared/types/errors';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { ErrorState } from '../../shared/ui/error-state';
import { PageHeader } from '../../shared/ui/page-header';
import { Skeleton } from '../../shared/ui/skeleton';
import { Table, TableBody, TableHead, TD, TH } from '../../shared/ui/table';

type TeamResponse = {
  teams: Team[];
  users: User[];
  subscriptions: Subscription[];
};

export const TeamPage = () => {
  const teamQuery = useQuery({
    queryKey: queryKeys.team,
    queryFn: () => apiFetch<TeamResponse>('/team')
  });

  if (teamQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (teamQuery.isError || !teamQuery.data) {
    const apiError = toApiClientError(teamQuery.error);
    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load team data.'}
        requestId={apiError?.requestId}
        onRetry={() => void teamQuery.refetch()}
      />
    );
  }

  const { teams, users, subscriptions } = teamQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Review team composition, user roles, and AI subscription ownership."
        primaryAction={<Button onClick={() => void teamQuery.refetch()}>Refresh team data</Button>}
        secondaryAction={<Button variant="secondary">Invite member</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {teams.map((team) => {
          const teamUsers = users.filter((user) => user.teamId === team.id);
          const teamSubCount = subscriptions.filter((subscription) => {
            const owner = users.find((user) => user.id === subscription.userId);
            return owner?.teamId === team.id && subscription.status === 'active';
          }).length;

          return (
            <Card key={team.id}>
              <h3 className="text-lg font-semibold text-slate-100">{team.name}</h3>
              <p className="mt-2 text-sm text-slate-400">Users: {teamUsers.length}</p>
              <p className="mt-1 text-sm text-slate-400">Active subscriptions: {teamSubCount}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Users</h2>
        <Table className="mt-3">
          <TableHead>
            <tr>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH>Team</TH>
              <TH>Role</TH>
              <TH>Subscriptions</TH>
            </tr>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const teamName = teams.find((team) => team.id === user.teamId)?.name ?? user.teamId;
              const subscriptionCount = subscriptions.filter(
                (subscription) => subscription.userId === user.id && subscription.status === 'active'
              ).length;

              return (
                <tr key={user.id}>
                  <TD>{user.name}</TD>
                  <TD>{user.email}</TD>
                  <TD>{teamName}</TD>
                  <TD>
                    <Badge tone={user.role === 'admin' ? 'info' : 'default'}>{user.role}</Badge>
                  </TD>
                  <TD>{subscriptionCount}</TD>
                </tr>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
