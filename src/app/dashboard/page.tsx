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
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { fetchBases } from "@/api/baseApi";

export default function Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUpload, setShowUpload] = useState(
    new URLSearchParams(location.search).get("showBaseUpload") === "true"
  );
  const [totalBases, setTotalBases] = useState(0);

  useEffect(() => {
    const isUploadView =
      new URLSearchParams(location.search).get("showBaseUpload") === "true";
    setShowUpload(isUploadView);
  }, [location.search]);

  useEffect(() => {
    const loadBasesCount = async () => {
      try {
        const bases = await fetchBases();
        setTotalBases(Array.isArray(bases) ? bases.length : 0);
      } catch (error) {
        console.error("Error fetching bases count:", error);
        setTotalBases(0);
      }
    };

    loadBasesCount();
  }, [refreshKey]);

  const handleBaseChange = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    if (showUpload) {
      setShowUpload(false);
      navigate("/dashboard");
    }
  }, [navigate, showUpload]);

  const toggleView = useCallback(() => {
    const newShowUpload = !showUpload;
    setShowUpload(newShowUpload);

    if (newShowUpload) {
      navigate("/dashboard?showBaseUpload=true", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [showUpload, navigate]);

  return (
    <SidebarProvider>
      <AppSidebar onBaseChange={handleBaseChange} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full justify-between">
            <div className="flex items-center gap-2">
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
                    <BreadcrumbPage className="text-pink-500">Total Bases: {totalBases}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button
              onClick={toggleView}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              {showUpload ? (
                <>
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">View Bases</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload Base</span>
                </>
              )}
            </Button>
          </div>
        </header>
        <main>
          {showUpload ? (
            <BaseUpload onSuccess={handleBaseChange} />
          ) : (
            <BaseList key={refreshKey} />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
