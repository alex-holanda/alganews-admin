import { useEffect } from 'react';

import { Area, AreaConfig } from '@ant-design/charts';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useMetric } from '../../core/hooks/useMetrics';

export default function CompanyMetrics() {
  const { data, fetchMonthlyRevenuesExpenses } = useMetric();

  useEffect(() => {
    fetchMonthlyRevenuesExpenses();
  }, [fetchMonthlyRevenuesExpenses]);

  const config: AreaConfig = {
    data,
    height: 256,
    color: ['#09f', '#274060'],
    areaStyle: {
      fillOpacity: 1,
    },
    xField: 'yearMonth',
    yField: 'value',
    seriesField: 'category',
    legend: {
      itemName: {
        formatter(legend) {
          return legend === 'totalRevenues' ? 'Receitas' : 'Despesas';
        },
      },
    },
    xAxis: {
      label: {
        formatter(item) {
          return format(new Date(item), 'MM/yyyy');
        },
      },
    },
    yAxis: false,
    tooltip: {
      title(title) {
        return format(new Date(title), 'MMMM yyyy', { locale: ptBR });
      },
      formatter(data) {
        return {
          name: data.category === 'totalRevenues' ? 'Receitas' : 'Despesas',
          value: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(data.value),
        };
      },
    },
    point: {
      size: 5,
      shape: 'circle',
    },
  };

  return <Area {...config} />;
}
