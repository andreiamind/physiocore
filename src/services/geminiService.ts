import { GoogleGenAI, Type } from "@google/genai";
import { SymptomLog } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAiInstance() {
  if (!aiInstance) {
    const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined;
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY não encontrada. A análise não funcionará.");
    }
    
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiInstance;
}

export const hasApiKey = !!(typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);

export async function analyzePatterns(logs: SymptomLog[]) {
  if (logs.length < 3) {
    return "Adicione pelo menos 3 registros para que eu possa identificar padrões.";
  }

  const ai = getAiInstance();

  const logsSummary = logs.map(l => ({
    data: l.date,
    periodo: l.period,
    intensidade: l.intensity,
    regioes: l.selectedRegions.map(r => `${r.name}: ${r.symptoms.join(", ")}`).join(" | "),
    relacionado_a: l.relatedTo.join(", "),
    melhora_com: l.betterWith.join(", "),
    piora_com: l.worseWith.join(", "),
    emocoes: l.emotions.join(", "),
    notas: l.notes
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise os seguintes registros de um paciente de fisioterapia. 
      Identifique correlações CLÍNICAS e MULTIFATORIAIS.
      
      Foque especialmente em:
      - Fatores de Melhora vs Piora: Como o paciente responde a diferentes estímulos (movimento, repouso, calor/gelo).
      - Raciocínio Clínico: Se a dor melhora com movimento, sugira que pode ser rigidez; se piora, pode ser sobrecarga.
      - Contexto: Como o trabalho, sono e emoções estão influenciando a intensidade.
      
      Seja técnico mas empático, educativo e organize as informações para auxiliar o raciocínio clínico do profissional. 
      O último item da análise deve ser intitulado "Conclusões para a Fisioterapia", contendo pontos relevantes para o acompanhamento profissional, sem parecer que o paciente está dando o diagnóstico.
      Use Markdown para formatar a resposta com títulos e listas.
      
      Registros:
      ${JSON.stringify(logsSummary, null, 2)}`,
      config: {
        systemInstruction: "Você é um especialista em fisioterapia e educação em dor. Sua missão é ajudar o paciente a perceber as nuances de seus sintomas, separando fatores físicos de emocionais e comportamentais, promovendo a auto-percepção.",
      }
    });

    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao analisar seus dados. Tente novamente mais tarde.";
  }
}
