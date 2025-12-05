import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap, MapPin } from "lucide-react";

const INSTITUICOES = [
  "Universidade Federal de Pernambuco",
  "Universidade Federal Rural de Pernambuco",
  "Universidade de Pernambuco",
  "Instituto Federal de Pernambuco",
  "Universidade Federal do Rio de Janeiro",
  "Universidade do Estado do Rio de Janeiro",
  "Universidade Federal Fluminense",
  "Universidade Federal do Estado do Rio de Janeiro",
  "Universidade de São Paulo",
  "Universidade Estadual de Campinas",
  "Universidade Estadual Paulista",
  "Universidade Federal de Minas Gerais",
  "Universidade Federal de Uberlândia",
  "Universidade Federal de Viçosa",
  "Universidade Federal da Bahia",
  "Universidade Federal de Santa Catarina",
  "Universidade Federal do Rio Grande do Sul",
  "Universidade Federal do Paraná",
  "Universidade de Brasília",
  "Universidade Federal do Ceará",
  "Universidade Federal do Amazonas",
  "Universidade Federal do Pará",
  "Universidade Federal de Goiás",
  "Universidade Federal do Espírito Santo",
  "Universidade Federal de Mato Grosso do Sul",
  "Universidade Federal de Mato Grosso",
  "Universidade Federal da Paraíba",
  "Universidade Federal do Piauí",
];

const CURSOS_POPULARES = [
  "Administração", "Direito", "Engenharia Civil", "Medicina", "Enfermagem", 
  "Pedagogia", "Psicologia", "Ciências Contábeis", "Educação Física", "Sistemas de Informação",
  "Arquitetura", "Fisioterapia", "Farmácia", "Odontologia", "Veterinária",
  "Ciência da Computação", "Engenharia de Computação", "Engenharia Elétrica", "Engenharia Mecânica",
  "Análise e Desenvolvimento de Sistemas", "Redes de Computadores", "Segurança da Informação",
  "Banco de Dados", "Gestão da Tecnologia da Informação", "Jogos Digitais", "Desenvolvimento Web",
  "Inteligência Artificial", "Ciência de Dados", "Engenharia de Software"
];

const TURNOS = ["Matutino", "Vespertino", "Noturno", "Integral"];

export default function FormularioSimulacao({ onSubmit }) {
  const [formData, setFormData] = useState({
    // Dados essenciais do modelo
    idade: "",
    modalidade_concorrencia: "", // modalidade concorrência
    pcd: "nao", // sim ou não
    sexo: "",
    raca_beneficiario: "", // raça beneficiário
    regiao_beneficiario: "", // região beneficiário
    modalidade_ensino: "", // modalidade ensino
    nome_turno: "", // nome do turno
    nome_curso: "", // nome do curso
    nome_instituicao: "", // nome da instituição
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idade || formData.idade < 14 || formData.idade > 100) {
      newErrors.idade = "Informe uma idade válida (14-100)";
    }
    if (!formData.modalidade_concorrencia) newErrors.modalidade_concorrencia = "Selecione a modalidade de concorrência";
    if (!formData.sexo) newErrors.sexo = "Selecione o sexo";
    if (!formData.raca_beneficiario) newErrors.raca_beneficiario = "Selecione a raça/cor";
    if (!formData.regiao_beneficiario) newErrors.regiao_beneficiario = "Selecione a região";
    if (!formData.modalidade_ensino) newErrors.modalidade_ensino = "Selecione a modalidade de ensino";
    if (!formData.nome_turno) newErrors.nome_turno = "Selecione o turno";
    if (!formData.nome_curso) newErrors.nome_curso = "Informe o nome do curso";
    if (!formData.nome_instituicao) newErrors.nome_instituicao = "Informe a instituição";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📋 Formulário - handleSubmit chamado');
    console.log('📋 Dados do formulário:', formData);
    
    if (validateForm()) {
      console.log('✅ Validação passou!');
      // Enviar os dados exatamente como o modelo espera
      const dadosFormatados = {
        idade: parseInt(formData.idade),
        modalidade_concorrencia: formData.modalidade_concorrencia,
        pcd: formData.pcd === "sim",
        sexo: formData.sexo,
        raca_beneficiario: formData.raca_beneficiario,
        regiao_beneficiario: formData.regiao_beneficiario,
        modalidade_ensino: formData.modalidade_ensino,
        nome_turno: formData.nome_turno,
        nome_curso: formData.nome_curso,
        nome_instituicao: formData.nome_instituicao,
      };
      
      console.log('📤 Enviando dados formatados:', dadosFormatados);
      onSubmit(dadosFormatados);
    } else {
      console.log('❌ Validação falhou!', errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
          Dados para Simulação ProUni
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-300">
          Preencha os campos essenciais para análise do modelo de IA
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Perfil Pessoal */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900/80 dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Perfil do Candidato
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="idade">Idade *</Label>
              <Input
                id="idade"
                type="number"
                min="14"
                max="100"
                placeholder="Ex: 18"
                className={errors.idade ? 'border-red-500' : ''}
                value={formData.idade}
                onChange={(e) => handleInputChange('idade', e.target.value)}
              />
              {errors.idade && <p className="text-sm text-red-500">{errors.idade}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo *</Label>
              <Select onValueChange={(value) => handleInputChange('sexo', value)} value={formData.sexo}>
                <SelectTrigger className={errors.sexo ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexo && <p className="text-sm text-red-500">{errors.sexo}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="raca_beneficiario">Raça/Cor *</Label>
              <Select onValueChange={(value) => handleInputChange('raca_beneficiario', value)} value={formData.raca_beneficiario}>
                <SelectTrigger className={errors.raca_beneficiario ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Branca">Branca</SelectItem>
                  <SelectItem value="Preta">Preta</SelectItem>
                  <SelectItem value="Parda">Parda</SelectItem>
                  <SelectItem value="Amarela">Amarela</SelectItem>
                  <SelectItem value="Indígena">Indígena</SelectItem>
                </SelectContent>
              </Select>
              {errors.raca_beneficiario && <p className="text-sm text-red-500">{errors.raca_beneficiario}</p>}
            </div>
            <div className="md:col-span-3 space-y-2">
              <Label>Possui Deficiência (PCD)? *</Label>
              <div className="flex items-center gap-6 mt-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="pcd" 
                    value="sim" 
                    checked={formData.pcd === 'sim'} 
                    onChange={() => handleInputChange('pcd', 'sim')} 
                    className="mr-2" 
                  />
                  Sim
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="pcd" 
                    value="nao" 
                    checked={formData.pcd === 'nao'} 
                    onChange={() => handleInputChange('pcd', 'nao')} 
                    className="mr-2" 
                  />
                  Não
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900/80 dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Região do Beneficiário
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="regiao_beneficiario">Região *</Label>
              <Select onValueChange={(value) => handleInputChange('regiao_beneficiario', value)} value={formData.regiao_beneficiario}>
                <SelectTrigger className={errors.regiao_beneficiario ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione a Região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Norte">Norte</SelectItem>
                  <SelectItem value="Nordeste">Nordeste</SelectItem>
                  <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                  <SelectItem value="Sudeste">Sudeste</SelectItem>
                  <SelectItem value="Sul">Sul</SelectItem>
                </SelectContent>
              </Select>
              {errors.regiao_beneficiario && <p className="text-sm text-red-500">{errors.regiao_beneficiario}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Informações do Curso */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900/80 dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Curso Pretendido
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome_instituicao">Nome da Instituição *</Label>
              <Select onValueChange={(value) => handleInputChange("nome_instituicao", value)} value={formData.nome_instituicao}>
                <SelectTrigger className={errors.nome_instituicao ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a instituição" />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUICOES.map(inst => (
                    <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nome_instituicao && <p className="text-sm text-red-500">{errors.nome_instituicao}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome_curso">Nome do Curso *</Label>
              <Select onValueChange={(value) => handleInputChange("nome_curso", value)} value={formData.nome_curso}>
                <SelectTrigger className={errors.nome_curso ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {CURSOS_POPULARES.map(curso => (
                    <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nome_curso && <p className="text-sm text-red-500">{errors.nome_curso}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome_turno">Nome do Turno *</Label>
              <Select onValueChange={(value) => handleInputChange("nome_turno", value)} value={formData.nome_turno}>
                <SelectTrigger className={errors.nome_turno ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  {TURNOS.map(turno => (
                    <SelectItem key={turno} value={turno}>{turno}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nome_turno && <p className="text-sm text-red-500">{errors.nome_turno}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modalidade_ensino">Modalidade de Ensino *</Label>
              <Select onValueChange={(value) => handleInputChange("modalidade_ensino", value)} value={formData.modalidade_ensino}>
                <SelectTrigger className={errors.modalidade_ensino ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="EAD">EAD (Educação a Distância)</SelectItem>
                </SelectContent>
              </Select>
              {errors.modalidade_ensino && <p className="text-sm text-red-500">{errors.modalidade_ensino}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="modalidade_concorrencia">Modalidade de Concorrência *</Label>
              <Select onValueChange={(value) => handleInputChange("modalidade_concorrencia", value)} value={formData.modalidade_concorrencia}>
                <SelectTrigger className={errors.modalidade_concorrencia ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ampla concorrência">Ampla concorrência</SelectItem>
                  <SelectItem value="L1">L1 - Renda ≤ 1,5 SM + Escola Pública</SelectItem>
                  <SelectItem value="L2">L2 - PPI + Renda ≤ 1,5 SM + Escola Pública</SelectItem>
                  <SelectItem value="L5">L5 - Escola Pública (independente de renda)</SelectItem>
                  <SelectItem value="L6">L6 - PPI + Escola Pública (independente de renda)</SelectItem>
                  <SelectItem value="L9">L9 - PCD + Renda ≤ 1,5 SM + Escola Pública</SelectItem>
                  <SelectItem value="L10">L10 - PCD + PPI + Renda ≤ 1,5 SM + Escola Pública</SelectItem>
                  <SelectItem value="L13">L13 - PCD + Escola Pública (independente de renda)</SelectItem>
                  <SelectItem value="L14">L14 - PCD + PPI + Escola Pública (independente de renda)</SelectItem>
                </SelectContent>
              </Select>
              {errors.modalidade_concorrencia && <p className="text-sm text-red-500">{errors.modalidade_concorrencia}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-6">
          <Button type="submit" className="w-full md:w-auto px-12 py-6 text-lg">
            Simular Resultado
          </Button>
        </div>
      </CardContent>
    </form>
  );
}
