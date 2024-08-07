'use client'
import { useFilters } from "@/hooks/useFilters";
import { Button, Select, SelectItem, Slider, Spinner, Switch} from "@nextui-org/react";

export default function Filters() {
  const {genderList, orderByList, filters,
     selectAge, selectGender, selectOrder, selectWithPhoto,
     clientLoaded,isPending} = useFilters()

  return (
    <div className="shadow-md py-2">
      <div className="flex flex-row justify-around items-center">
        <div className="flex gap-2 items-center">
        <div className="text-primary font-semibold text-xl">结果:10</div>
        {isPending && <Spinner size='sm' color='primary'/>}
        </div>

        <div className="flex gap-2 items-center">
          <div>性别：</div>
          {genderList.map(({ icon: Icon, value }) => (
            <Button key={value} size="sm" isIconOnly 
            color={filters.gender.includes(value)? 'primary' : 'default'} 
            onClick={()=>selectGender(value)}
            >
              <Icon size={24} />
            </Button>
          ))}
        </div>
        <div className="flex flex-row items-center gap-2 w-1/4">
          <Slider
            label={clientLoaded && "年龄范围"}
            color="primary"
            size="sm"
            minValue={18}
            maxValue={100}
            defaultValue={filters.ageRange}
            onChangeEnd={(value) => selectAge(value as number[])}
            aria-label="年龄范围滑条"
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm">有照片的</p>
            <Switch color="primary" defaultSelected size='sm' onChange={selectWithPhoto} />
        </div>
        <div className="w-1/4">
          <Select
            size="sm"
            fullWidth
            label="排序方式"
            variant="bordered"
            color="primary"
            aria-label="以...选择排序"
            selectedKeys={new Set([filters.orderBy])}
            onSelectionChange={selectOrder}
          >
             {orderByList.map(item => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
