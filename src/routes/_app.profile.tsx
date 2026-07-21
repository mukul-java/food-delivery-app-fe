import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { FormField, FormWrapper } from "@/components/forms";
import { initials as toInitials } from "@/utils/string";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const initials = toInitials(user?.username);

  return (
    <div>
      <PageHeader title="Profile" description="Your account information" />
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-lg font-semibold">{user?.username}</h3>
            <p className="text-sm text-muted-foreground">{user?.role}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account details</CardTitle>
          </CardHeader>
          <CardContent>
            <FormWrapper aria-label="Profile form" onSubmit={(e) => e.preventDefault()}>
              <FormField
                id="username"
                label="Username"
                value={user?.username ?? ""}
                readOnly
              />
              <FormField
                id="role"
                label="Role"
                value={user?.role ?? ""}
                readOnly
              />
            </FormWrapper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
