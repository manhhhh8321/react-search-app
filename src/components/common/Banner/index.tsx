import LogoIcon from "@/assets/icons/LogoIcon";

function SearchPageBanner() {
  return (
    <div className="bg-[#F0F0F0]">
      <div className="flex w-4/5 mx-auto items-center gap-2 text-xs py-2 text-[#5B5B5B]">
        <LogoIcon />
        <div>
          An Official Website of the{" "}
          <span className="font-semibold">Singapore Government</span>
        </div>
      </div>
    </div>
  );
}

export default SearchPageBanner;
