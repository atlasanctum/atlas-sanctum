import React, { useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, XCircle, Loader2, Send, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const EmailVerificationStatus = () => {
  const { user } = useSupabaseAuth();
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const isEmailVerified = !!user?.email_confirmed_at;

  const resendVerificationEmail = async () => {
    if (!user?.email || cooldown) return;

    setSending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Verification email sent! Check your inbox.");
      
      // Set cooldown to prevent spam
      setCooldown(true);
      setTimeout(() => setCooldown(false), 60000); // 1 minute cooldown
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast.error(error.message || "Failed to send verification email");
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Verification
        </CardTitle>
        <CardDescription>
          Verify your email address to unlock all features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isEmailVerified ? "bg-primary/10" : "bg-destructive/10"
              }`}
            >
              {isEmailVerified ? (
                <CheckCircle className="w-5 h-5 text-primary" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                {isEmailVerified ? "Email verified" : "Email not verified"}
              </p>
            </div>
          </div>
          <Badge variant={isEmailVerified ? "default" : "destructive"}>
            {isEmailVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>

        {!isEmailVerified && (
          <>
            <Alert className="border-warning/50 bg-warning/10">
              <AlertDescription className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Verify your email</p>
                  <p className="text-sm text-muted-foreground">
                    Please check your inbox for a verification link. If you didn't receive it,
                    you can request a new one below.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              onClick={resendVerificationEmail}
              disabled={sending || cooldown}
              className="w-full"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : cooldown ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Wait 1 minute...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Make sure to check your spam folder if you don't see the email
            </p>
          </>
        )}

        {isEmailVerified && (
          <div className="text-center text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 inline mr-1 text-primary" />
            Your email was verified on{" "}
            {new Date(user.email_confirmed_at!).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerificationStatus;
