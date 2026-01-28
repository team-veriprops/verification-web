export function CheckoutFooter() {
  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </div>
          <p className="text-center sm:text-right">
            © 2024 Veriprops. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
