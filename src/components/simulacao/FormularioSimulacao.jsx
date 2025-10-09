import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap, DollarSign, MapPin } from "lucide-react";

const ESTADOS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const CURSOS_POPULARES = [
  "Administração", "Direito", "Engenharia Civil", "Medicina", "Enfermagem", 
  "Pedagogia", "Psicologia", "Ciências Contábeis", "Educação Física", "Sistemas de Informação",
  "Arquitetura", "Fisioterapia", "Farmácia", "Odontologia", "Veterinária"
];

export default function FormularioSimulacao({ onSubmit }) {
  const [formData, setFormData] = useState({
    idade: "",
    sexo: "",
    renda_familiar: "",
    membros_familia: "",
    nota_enem: "",
    tipo_escola: "",
    turno_pretendido: "",
    estado: "",
    curso_pretendido: "",
    pessoa_deficiencia: false
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

    if (!formData.idade || formData.idade < 16 || formData.idade > 70) {
      newErrors.idade = "Idade deve estar entre 16 e 70 anos";
    }
    if (!formData.sexo) newErrors.sexo = "Selecione o sexo";
    if (!formData.renda_familiar || formData.renda_familiar < 0) {
      newErrors.renda_familiar = "Informe a renda familiar";
    }
    if (!formData.nota_enem || formData.nota_enem < 0 || formData.nota_enem > 1000) {
      newErrors.nota_enem = "Nota do ENEM deve estar entre 0 e 1000";
    }
    if (!formData.tipo_escola) newErrors.tipo_escola = "Selecione o tipo de escola";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        idade: parseInt(formData.idade),
        renda_familiar: parseFloat(formData.renda_familiar),
        membros_familia: parseInt(formData.membros_familia) || 4,
        nota_enem: parseFloat(formData.nota_enem)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl text-slate-900">
          Seus dados para análise
        </CardTitle>
        <p className="text-slate-600">
          Todas as informações são confidenciais e usadas apenas para simulação
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Dados Pessoais */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-blue-600" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="idade">Idade *</Label>
              <Input
                id="idade"
                type="number"
                min="16"
                max="70"
                value={formData.idade}
                onChange={(e) => handleInputChange("idade", e.target.value)}
                className={errors.idade ? "border-red-500" : ""}
              />
              {errors.idade && <p className="text-sm text-red-500">{errors.idade}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo *</Label>
              <Select value={formData.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
                <SelectTrigger className={errors.sexo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione seu sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexo && <p className="text-sm text-red-500">{errors.sexo}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Dados Socioeconômicos */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              Situação Socioeconômica
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="renda_familiar">Renda Familiar Mensal (R$) *</Label>
              <Input
                id="renda_familiar"
                type="number"
                min="0"
                step="0.01"
                value={formData.renda_familiar}
                onChange={(e) => handleInputChange("renda_familiar", e.target.value)}
                className={errors.renda_familiar ? "border-red-500" : ""}
                placeholder="Ex: 2500.00"
              />
              {errors.renda_familiar && <p className="text-sm text-red-500">{errors.renda_familiar}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="membros_familia">Membros da Família</Label>
              <Input
                id="membros_familia"
                type="number"
                min="1"
                value={formData.membros_familia}
                onChange={(e) => handleInputChange("membros_familia", e.target.value)}
                placeholder="Ex: 4 (padrão)"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pessoa_deficiencia"
                  checked={formData.pessoa_deficiencia}
                  onCheckedChange={(checked) => handleInputChange("pessoa_deficiencia", checked)}
                />
                <Label htmlFor="pessoa_deficiencia" className="text-sm">
                  Sou pessoa com deficiência
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Acadêmicos */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              Dados Acadêmicos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nota_enem">Nota Média do ENEM *</Label>
              <Input
                id="nota_enem"
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={formData.nota_enem}
                onChange={(e) => handleInputChange("nota_enem", e.target.value)}
                className={errors.nota_enem ? "border-red-500" : ""}
                placeholder="Ex: 650.5"
              />
              {errors.nota_enem && <p className="text-sm text-red-500">{errors.nota_enem}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_escola">Tipo de Escola (Ensino Médio) *</Label>
              <Select value={formData.tipo_escola} onValueChange={(value) => handleInputChange("tipo_escola", value)}>
                <SelectTrigger className={errors.tipo_escola ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Publica">Escola Pública</SelectItem>
                  <SelectItem value="Privada">Escola Privada</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_escola && <p className="text-sm text-red-500">{errors.tipo_escola}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno_pretendido">Turno Pretendido</Label>
              <Select value={formData.turno_pretendido} onValueChange={(value) => handleInputChange("turno_pretendido", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matutino">Matutino</SelectItem>
                  <SelectItem value="Vespertino">Vespertino</SelectItem>
                  <SelectItem value="Noturno">Noturno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="curso_pretendido">Curso de Interesse</Label>
              <Select value={formData.curso_pretendido} onValueChange={(value) => handleInputChange("curso_pretendido", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {CURSOS_POPULARES.map((curso) => (
                    <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-red-600" />
              Localização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado onde pretende estudar</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BRASIL.map((estado) => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Botão de envio */}
        <div className="text-center pt-6">
          <Button 
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-12 py-6 text-lg font-semibold rounded-2xl shadow-xl"
          >
            Enviar para análise
          </Button>
          <p className="text-sm text-slate-500 mt-3">
            * Campos obrigatórios
          </p>
        </div>
      </CardContent>
    </form>
  );
}