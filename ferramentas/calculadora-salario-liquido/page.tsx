import SalaryCalculatorContent from "./components/salary-calculator-content";
import SalaryArticle from "./components/salary-article";
import Link from "next/link";

export default function SalaryCalculatorPage() {
  return (
    <section className="flex flex-col gap-6 py-10">
      <h1 className="text-xl md:text-3xl font-semibold text-primary">
        Calculadora de Salário Líquido {new Date().getFullYear()}
      </h1>
      <p className="lg:max-w-3xl">
        Descubra quanto do seu salário você realmente recebe. Nossa calculadora
        de salário líquido considera os descontos de INSS, IRRF e número de
        dependentes para gerar o valor final.
      </p>
      <SalaryCalculatorContent />
      <SalaryArticle />
      <div className="mt-8">
        <h3 className="font-semibold text-xl">Veja também:</h3>
        <Link
          href="/calculadora-adicional-noturno"
          className="text-link underline"
        >
          Calculadora adicional noturno
        </Link>
      </div>
    </section>
  );
}
