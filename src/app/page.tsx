import Header from "@/shared/components/Header";
import ProfileStats from "@/features/home/components/ProfileStats";
import ActionMenu from "@/features/home/components/ActionMenu";
import BottomNavigation from "@/shared/components/BottomNavigation";

export default function Dashboard() {
  return (
    <div className="bg-gray-200 min-h-screen flex justify-center font-sans">
      <div className="w-full max-w-[400px] bg-slate-50 min-h-screen relative shadow-2xl flex flex-col overflow-hidden">
        <Header />

        {/* Main Content Area */}
        <div className="flex-1 px-6 -mt-12 z-10 pb-28 overflow-y-auto">
          <ProfileStats />
          <ActionMenu />
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}
