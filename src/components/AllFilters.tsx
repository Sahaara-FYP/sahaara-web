/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  RequestCategoryItems,
  RequestFemaleOnlyItems,
  RequestRevealIdentityItems,
  RequestStatusItems,
  RequestUrgentItems,
  RequestWillingToPayItems,
} from "@/types/Requests";
import SelectFilter from "./SelectFilter";

interface AllFiltersPropTypes {
  filterType?: string;
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const AllFilters = ({
  filterType,
  filters,
  setFilters,
}: AllFiltersPropTypes) => {
  const requestFilterConfigs = [
    {
      label: "Category",
      component: (
        <SelectFilter
          items={RequestCategoryItems}
          label={"requestCategory"}
          value={filters["requestCategory"]}
          setValue={setFilters}
        />
      ),
    },
    {
      label: "Identity",
      component: (
        <SelectFilter
          items={RequestRevealIdentityItems}
          value={filters["requestIdentity"]}
          label={"requestIdentity"}
          setValue={setFilters}
        />
      ),
    },
    {
      label: "Status",
      component: (
        <SelectFilter
          items={RequestStatusItems}
          label={"requestStatus"}
          value={filters["requestStatus"]}
          setValue={setFilters}
        />
      ),
    },
    {
      label: "Willing To Pay",
      component: (
        <SelectFilter
          items={RequestWillingToPayItems}
          label={"requestWillingToPay"}
          value={filters["requestWillingToPay"]}
          setValue={setFilters}
        />
      ),
    },
    {
      label: "Urgent",
      component: (
        <SelectFilter
          items={RequestUrgentItems}
          label={"requestUrgent"}
          value={filters["requestUrgent"]}
          setValue={setFilters}
        />
      ),
    },
    {
      label: "Female Only",
      component: (
        <SelectFilter
          items={RequestFemaleOnlyItems}
          label={"requestFemaleOnly"}
          value={filters["requestFemaleOnly"]}
          setValue={setFilters}
        />
      ),
    },
  ];

  return (
    <div className="bg-app-foreground py-6 pb-10 px-8 rounded-2xl xl:mr-5 max-xl:mb-5 border">
      <h2 className="text-xl font-semibold">Filters</h2>
      <div className="mt-4">
        {filterType == "requests" ? (
          <div className="flex xl:flex-col gap-4 max-xl:flex-wrap">
            {requestFilterConfigs.map(({ label, component }, key) => (
              <div
                key={key}
                className="flex gap-3 items-center justify-between"
              >
                <span className="text-app-primary-text text-sm">{label}</span>
                {component}
              </div>
            ))}
          </div>
        ) : (
          <>
            <p>No filters were passed</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AllFilters;
