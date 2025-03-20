using System.Text.RegularExpressions;

namespace PaymentAPI.Utils
{
    public static class CpfValidator
    {
        public static bool IsValid(string cpf)
        {
            // Remove caracteres não numéricos
            cpf = Regex.Replace(cpf, @"[^\d]", "");

            // Verifica se tem 11 dígitos
            if (cpf.Length != 11)
                return false;

            // Verifica se todos os dígitos são iguais
            if (cpf.Distinct().Count() == 1)
                return false;

            // Calcula primeiro dígito verificador
            int soma = 0;
            for (int i = 0; i < 9; i++)
                soma += int.Parse(cpf[i].ToString()) * (10 - i);

            int digito1 = 11 - (soma % 11);
            if (digito1 > 9)
                digito1 = 0;

            // Calcula segundo dígito verificador
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(cpf[i].ToString()) * (11 - i);

            int digito2 = 11 - (soma % 11);
            if (digito2 > 9)
                digito2 = 0;

            // Verifica se os dígitos calculados são iguais aos dígitos informados
            return int.Parse(cpf[9].ToString()) == digito1 &&
                   int.Parse(cpf[10].ToString()) == digito2;
        }
    }
}