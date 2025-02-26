import { AppSidebar } from "@/components/app-sidebar";
import BaseList from "@/components/BaseList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router";
import BaseUpload from "@/page/base/BaseUpload";
import { useState, useCallback } from "react";

export default function Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const showBaseUpload =
    new URLSearchParams(location.search).get("showBaseUpload") === "true";

  const handleBaseChange = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    if (showBaseUpload) {
      navigate("/dashboard");
    }
  }, [navigate, showBaseUpload]);

  return (
    <SidebarProvider>
      <AppSidebar onBaseChange={handleBaseChange} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main>
          {showBaseUpload ? (
            <BaseUpload onSuccess={handleBaseChange} />
          ) : (
            <BaseList key={refreshKey} />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
