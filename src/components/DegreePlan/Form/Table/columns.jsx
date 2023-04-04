import { Icon } from "@iconify/react"
import { iconNames } from "../../../../utils/constants"
export const columns = [
    {
        title: ' ',
        width: '2%',
        align: 'center',
        render: () => (
          <Icon icon={iconNames.threeDots} className="xxs icon grey pointer" />
        ),
    },
    {
      title: 'Course Title',
      dataIndex: 'name',
      key: 'name',
      width: '45%',
    },
    {
      title: 'Course Num',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'UTD Sem',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: 'Transfer',
      dataIndex: 'transfer',
      key: 'transfer',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
    },  
];