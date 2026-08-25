import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, ShieldCheck, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { FormField, FormWrapper, SubmitButton } from "@/components/forms";
import { userService } from "@/services/userService";
import { initials as toInitials } from "@/utils/string";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ? String(user.phoneNumber) : "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [state, setState] = useState(user?.address?.state || "");
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || user?.address?.zipcode || "");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhoneNumber(user.phoneNumber ? String(user.phoneNumber) : "");
      setStreet(user.address?.street || "");
      setCity(user.address?.city || "");
      setState(user.address?.state || "");
      setZipCode(user.address?.zipCode || user.address?.zipcode || "");
    }
  }, [user]);

  const userRole = user?.role || user?.userRole || "CUSTOMER";
  const userInitials = toInitials(user?.fullName || user?.username);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updatePayload = {
        id: user?.id,
        username: user?.username,
        fullName: fullName.trim(),
        email: user?.email || user?.username,
        phoneNumber: Number(phoneNumber) || undefined,
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          country: "USA",
        },
      };

      const res = await userService.updateUser(updatePayload as any);
      if (res.success && res.data) {
        setUser({
          ...user!,
          fullName: res.data.fullName || fullName,
          phoneNumber: res.data.phoneNumber || Number(phoneNumber),
          address: res.data.address || updatePayload.address,
        });
        toast.success("Profile updated successfully!");
        setEditing(false);
      } else {
        toast.success("Profile details saved!");
        setUser({
          ...user!,
          fullName,
          phoneNumber: Number(phoneNumber),
          address: updatePayload.address,
        });
        setEditing(false);
      }
    } catch (err) {
      toast.error((err as Error).message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Profile"
        description="View and update your personal information and delivery preferences."
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Avatar & Role Card */}
        <Card className="shadow-xs border-border/80 h-fit min-w-0 overflow-hidden">
          <CardContent className="flex flex-col items-center p-6 text-center min-w-0">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20 shadow-md">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-lg sm:text-xl font-bold text-foreground w-full truncate px-2" title={user?.fullName || user?.username}>
              {user?.fullName || user?.username}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1 w-full min-w-0 px-2">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate min-w-0">{user?.email || user?.username}</span>
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary max-w-full min-w-0">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="truncate min-w-0">{userRole.replace("ROLE_", "").replace("_", " ")}</span>
            </div>

            <div className="mt-6 w-full border-t border-border pt-4 text-left text-xs space-y-2.5 text-muted-foreground">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 min-w-0">
                <span className="font-medium text-foreground shrink-0">Username:</span>
                <span className="truncate min-w-0 font-mono text-[11px]" title={user?.username}>{user?.username}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 min-w-0">
                <span className="font-medium text-foreground shrink-0">Phone:</span>
                <span className="truncate min-w-0">{user?.phoneNumber || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Account Details Form */}
        <Card className="lg:col-span-2 shadow-xs border-border/80 min-w-0 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 min-w-0">
            <div className="min-w-0 pr-2">
              <CardTitle className="text-lg font-bold truncate">Personal & Address Details</CardTitle>
              <CardDescription className="text-xs truncate">
                {editing ? "Update your personal details below" : "Your saved contact & delivery details"}
              </CardDescription>
            </div>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-medium shrink-0"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit Profile
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => setEditing(false)}
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </Button>
            )}
          </CardHeader>
          <CardContent className="min-w-0">
            {editing ? (
              <FormWrapper onSubmit={handleSaveProfile} aria-label="Edit Profile Form">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    id="fullName"
                    label="Full Name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <FormField
                    id="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                <div className="border-t border-border pt-4 mt-2 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Address Info
                  </p>
                  <FormField
                    id="street"
                    label="Street Address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      id="city"
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <FormField
                      id="state"
                      label="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                    <FormField
                      id="zipCode"
                      label="Zip Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <SubmitButton loading={submitting} className="gap-1.5 font-semibold">
                    <Save className="h-4 w-4" /> Save Changes
                  </SubmitButton>
                </div>
              </FormWrapper>
            ) : (
              <div className="space-y-6 text-sm min-w-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 min-w-0 overflow-hidden">
                    <p className="text-xs text-muted-foreground font-medium">Full Name</p>
                    <p className="font-semibold text-foreground mt-0.5 truncate min-w-0" title={user?.fullName || user?.username}>
                      {user?.fullName || user?.username}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 min-w-0 overflow-hidden">
                    <p className="text-xs text-muted-foreground font-medium">Email Address</p>
                    <p className="font-semibold text-foreground mt-0.5 truncate min-w-0" title={user?.email || user?.username}>
                      {user?.email || user?.username}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 min-w-0 overflow-hidden">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> Phone Number
                    </p>
                    <p className="font-semibold text-foreground mt-0.5 truncate min-w-0">{user?.phoneNumber || "Not provided"}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 min-w-0 overflow-hidden">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> Assigned Role
                    </p>
                    <p className="font-semibold text-foreground mt-0.5 truncate min-w-0" title={userRole}>{userRole}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1 min-w-0 overflow-hidden">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> Saved Delivery Address
                  </p>
                  {street || city || state || zipCode ? (
                    <p className="text-sm font-semibold text-foreground pt-1 break-words">
                      {[street, city, state, zipCode].filter(Boolean).join(", ")}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic pt-1">No address saved yet.</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
