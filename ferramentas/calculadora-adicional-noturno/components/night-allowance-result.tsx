"use client";

import { CalculateNightAllowanceResult } from "../types";

type NightAllowanceResultCardProps = {
  result: CalculateNightAllowanceResult | null;
};

export function NightAllowanceResultCard(props: NightAllowanceResultCardProps) {
  const { result } = props;

  const {
    grossSalary = 0,
    contractualHours = 0,
    workedHours = 0,
    percentageAllowance = 0,
    hourValue = 0,
    nightHoursWorked = 0,
    allowanceValue = 0,
    rsrDsr = 0,
    hourWithAllowance = 0,
    totalAllowanceDue = 0,
  } = result || {};

  const hasResult = Boolean(result);

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }

  function formatHours(value: number) {
    return `${value.toFixed(2)}h`;
  }

  return (
    <div className="w-full lg:w-1/2 bg-gray-50 p-6 rounded-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Resultado</h2>

      {hasResult && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Dados informados
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Salário bruto:</span>
                <span className="font-medium">
                  {formatCurrency(grossSalary)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horas contratuais:</span>
                <span className="font-medium">{contractualHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horas trabalhadas:</span>
                <span className="font-medium">{formatHours(workedHours)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Percentual do adicional noturno:
                </span>
                <span className="font-medium">{percentageAllowance}%</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Cálculos</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Valor da hora:</span>
                <span className="font-medium">{formatCurrency(hourValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Horas noturnas trabalhadas:
                </span>
                <span className="font-medium">
                  {formatHours(nightHoursWorked)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Valor do adicional por hora:
                </span>
                <span className="font-medium">
                  {formatCurrency(allowanceValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hora com adicional:</span>
                <span className="font-medium">
                  {formatCurrency(hourWithAllowance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">RSR/DSR:</span>
                <span className="font-medium">{formatCurrency(rsrDsr)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
            <span className="text-lg font-bold text-gray-800">
              Total do adicional devido:
            </span>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAllowanceDue)}
            </span>
          </div>
        </div>
      )}

      {!hasResult && (
        <p className="text-gray-500 text-sm">
          Preencha o formulário e clique em{" "}
          <strong>Calcular Adicional Noturno</strong> para ver o resultado.
        </p>
      )}
    </div>
  );
}
