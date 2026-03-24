import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">About PlayerVault</h1>

      <Card>
        <CardHeader>
          <CardTitle>Who we are</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            PlayerVault is a cross-sport search platform built to help fans,
            recruiters, and analysts quickly find athlete profiles in one place.
          </p>
          <p>
            Our goal is simple: make player discovery faster, clearer, and more enjoyable
            with responsive design, clean profile views, and practical filtering tools.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility commitment</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-1">
            <li>Semantic layout, logical heading structure, and keyboard-first navigation</li>
            <li>Visible focus styles and clear component states across interactive elements</li>
            <li>Form labels, concise validation feedback, and readable contrast choices</li>
            <li>Reduced-motion support for users who prefer less animation</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & data usage</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-1">
            <li>No account creation is required to browse or search player data</li>
            <li>Search queries are sent from your browser to third-party sports data APIs</li>
            <li>We do not sell personal data and we minimise local data storage</li>
            <li>Only essential technical data may be processed to keep the service reliable</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Questions, feedback, or corrections?</p>
          <p>Email: support@playervault.com</p>
          <p>Updated: March 2026</p>
        </CardContent>
      </Card>
    </div>
  );
}
