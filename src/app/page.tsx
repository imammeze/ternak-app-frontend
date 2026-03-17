import Header from "@/shared/components/Header";
import ProfileStats from "@/features/home/components/ProfileStats";
import ActionMenu from "@/features/home/components/ActionMenu";

export default function Dashboard() {
  return (
    <>
      <Header />

      <div className="flex-1 px-6 -mt-12 z-10 pb-28 overflow-y-auto">
        <ProfileStats />
        <ActionMenu />
      </div>
    </>
  );
}
