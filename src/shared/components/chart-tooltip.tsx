import React from 'react';
import { Tooltip } from 'recharts';

const ChartTooltip = () => {
  return (
    <Tooltip
      contentStyle={{
        backgroundColor: 'var(--color-main-text)', // tooltip background
        border: '1px solid var(--color-main-text)', // border
        borderRadius: 'var(--radius-level1)', // rounded corners
        padding: '10px',
        color: 'var(--color-main-background)', // text color
      }}
      itemStyle={{
        color: 'var(--color-main-background)', // color for each value
        fontWeight: 'bold',
      }}
      cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} // hover effect on chart
    />
  );
};

export default ChartTooltip;
