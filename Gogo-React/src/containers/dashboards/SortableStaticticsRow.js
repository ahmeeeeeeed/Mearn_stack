import React from 'react'
import Sortable from "react-sortablejs";

import { Colxx } from "../../components/common/CustomBootstrap";
import RadialProgressCard from "../../components/cards/RadialProgressCard";


const SortableStaticticsRow = ({messages}) => {
  return (
      <Sortable options={{handle: ".handle"}} className="row">
        <Colxx xl="6" lg="6" className="mb-4">
          <RadialProgressCard
              title={messages["dashboards.training-progress"]}
              percent={64}
              isSortable={true}
          />
        </Colxx>
        <Colxx xl="6" lg="6" className="mb-4">
          <RadialProgressCard
              title={messages["dashboards.work-progress"]}
              percent={75}
              isSortable={true}
          />
        </Colxx>

      </Sortable>
  )
}
export default SortableStaticticsRow
