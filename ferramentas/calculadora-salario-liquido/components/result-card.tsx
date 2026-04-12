import { CalculateResult } from "../types";

type ResultCardProps = {
  result: CalculateResult | null;
};

export default function ResultCard({ result }: ResultCardProps) {
  const {
    grossSalary = 0,
    netSalary = 0,
    inss = 0,
    irrf = 0,
    totalDiscounts = 0,
    benefits = 0,
  } = result || {};

  const hasResult = Boolean(result);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

  return (
    <div className="w-full lg:w-1/2 bg-gray-50 p-6 rounded-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Resultado</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Salário Bruto:</span>
          <span className="font-medium">
            {hasResult ? formatCurrency(grossSalary) : "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Benefícios:</span>
          <span className="font-medium">
            {hasResult ? formatCurrency(benefits) : "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Desconto INSS:</span>
          <span className="font-medium">
            {hasResult ? formatCurrency(inss) : "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Desconto IRRF:</span>
          <span className="font-medium">
            {hasResult ? formatCurrency(irrf) : "—"}
          </span>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-3">
          <span className="text-gray-700 font-semibold">
            Total de Descontos:
          </span>
          <span className="font-semibold text-red-600">
            {hasResult ? formatCurrency(totalDiscounts) : "—"}
          </span>
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
          <span className="text-lg font-bold text-gray-800">
            Salário Líquido:
          </span>
          <span className="text-2xl font-bold text-green-600">
            {hasResult ? formatCurrency(netSalary) : "—"}
          </span>
        </div>
      </div>

      {!hasResult && (
        <p className="text-gray-500 text-sm mt-4">
          Preencha o formulário e clique em <strong>Calcular</strong> para ver o
          resultado.
        </p>
      )}
    </div>
  );
}
