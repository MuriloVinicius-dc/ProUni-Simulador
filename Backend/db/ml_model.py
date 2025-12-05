import os
import numpy as np
import pandas as pd
from typing import Dict, Any
import joblib

# Paths (Assumindo recursos estão na mesma pasta)
MODELO_PATH = os.path.join(os.path.dirname(__file__), "modelo_rf.pkl")
COLUNAS_PATH = os.path.join(os.path.dirname(__file__), "colunas_esperadas.pkl")
IES_PATH = os.path.join(os.path.dirname(__file__), "top_ies_agrupadas.pkl")
CURSO_PATH = os.path.join(os.path.dirname(__file__), "top_cursos_agrupados.pkl")

# Variáveis globais para armazenar os recursos
MODELO_DE_IA = None
COLUNAS_ESPERADAS = None 
TOP_IES = None 
TOP_CURSOS = None 

# Lista COLUNAS_FIM original (manter por compatibilidade se estiver sendo usada em outro lugar, mas COLUNAS_ESPERADAS será carregada do PKL)
COLUNAS_FIM = [
    'IDADE',
    'RACA_BENEFICIARIO_BOLSA_Amarela',
    'RACA_BENEFICIARIO_BOLSA_Branca',
    'RACA_BENEFICIARIO_BOLSA_Indígena',
    'RACA_BENEFICIARIO_BOLSA_Não Informada',
    'RACA_BENEFICIARIO_BOLSA_Parda',
    'RACA_BENEFICIARIO_BOLSA_Preta',
    'REGIAO_BENEFICIARIO_BOLSA_Centro-Oeste',
    'REGIAO_BENEFICIARIO_BOLSA_Nordeste',
    'REGIAO_BENEFICIARIO_BOLSA_Norte',
    'REGIAO_BENEFICIARIO_BOLSA_Sudeste',
    'REGIAO_BENEFICIARIO_BOLSA_Sul',
    'MODALIDADE_ENSINO_BOLSA_EAD',
    'MODALIDADE_ENSINO_BOLSA_Presencial',
    'NOME_TURNO_CURSO_BOLSA_Curso a distância',
    'NOME_TURNO_CURSO_BOLSA_Integral',
    'NOME_TURNO_CURSO_BOLSA_Matutino',
    'NOME_TURNO_CURSO_BOLSA_Noturno',
    'NOME_TURNO_CURSO_BOLSA_Vespertino',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO CAMPOS DE ANDRADE',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO CEUNI - FAMETRO',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO CLARETIANO',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO DA FUNDAÇÃO EDUCACIONAL INACIANA PE SABÓIA DE MEDEIROS',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO DAS FACULDADES METROPOLITANAS UNIDAS',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO DE BELO HORIZONTE',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO DE MARINGÁ - UNICESUMAR',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO ESTÁCIO DE RIBEIRÃO PRETO',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO EURO-AMERICANO',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO FANOR WYDEN',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO FAVIP WYDEN',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO INTERNACIONAL',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO LEONARDO DA VINCI',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO METROCAMP WYDEN',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO RUY BARBOSA WYDEN',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO SÃO MIGUEL',
    'NOME_IES_AGRUPADO_CENTRO UNIVERSITÁRIO UNA',
    'NOME_IES_AGRUPADO_FACULDADE DO MARANHÃO',
    'NOME_IES_AGRUPADO_FACULDADE EDUCACIONAL DA LAPA',
    'NOME_IES_AGRUPADO_FACULDADE UNIDA DE CAMPINAS',
    'NOME_IES_AGRUPADO_FACULDADE ÁREA1 WYDEN',
    'NOME_IES_AGRUPADO_OUTRAS_IES',
    'NOME_IES_AGRUPADO_PONTIFÍCIA UNIVERSIDADE CATÓLICA DE MINAS GERAIS',
    'NOME_IES_AGRUPADO_PONTIFÍCIA UNIVERSIDADE CATÓLICA DO PARANÁ',
    'NOME_IES_AGRUPADO_UNIVERSIDADE ANHANGUERA',
    'NOME_IES_AGRUPADO_UNIVERSIDADE ANHANGUERA DE SÃO PAULO',
    'NOME_IES_AGRUPADO_UNIVERSIDADE ANHEMBI MORUMBI',
    'NOME_IES_AGRUPADO_UNIVERSIDADE CEUMA',
    'NOME_IES_AGRUPADO_UNIVERSIDADE CIDADE DE SÃO PAULO',
    'NOME_IES_AGRUPADO_UNIVERSIDADE CRUZEIRO DO SUL',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DE FRANCA',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DE MOGI DAS CRUZES',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DE PASSO FUNDO',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DE RIBEIRÃO PRETO',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DE UBERABA',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DO OESTE DE SANTA CATARINA',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DO OESTE PAULISTA',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DO SUL DE SANTA CATARINA',
    'NOME_IES_AGRUPADO_UNIVERSIDADE DO VALE DO ITAJAÍ',
    'NOME_IES_AGRUPADO_UNIVERSIDADE ESTÁCIO DE SÁ',
    'NOME_IES_AGRUPADO_UNIVERSIDADE LUTERANA DO BRASIL',
    'NOME_IES_AGRUPADO_UNIVERSIDADE NOVE DE JULHO',
    'NOME_IES_AGRUPADO_UNIVERSIDADE PAULISTA',
    'NOME_IES_AGRUPADO_UNIVERSIDADE PITÁGORAS UNOPAR',
    'NOME_IES_AGRUPADO_UNIVERSIDADE POTIGUAR',
    'NOME_IES_AGRUPADO_UNIVERSIDADE PRESBITERIANA MACKENZIE',
    'NOME_IES_AGRUPADO_UNIVERSIDADE SALVADOR',
    'NOME_IES_AGRUPADO_UNIVERSIDADE SANTO AMARO',
    'NOME_IES_AGRUPADO_UNIVERSIDADE SÃO JUDAS TADEU',
    'NOME_IES_AGRUPADO_UNIVERSIDADE TIRADENTES',
    'NOME_IES_AGRUPADO_UNIVERSIDADE VEIGA DE ALMEIDA',
    'NOME_CURSO_AGRUPADO_Administração',
    'NOME_CURSO_AGRUPADO_Administração (Ead)',
    'NOME_CURSO_AGRUPADO_Administração Com Habilitação Em Administração De Empresas',
    'NOME_CURSO_AGRUPADO_Agronegócio',
    'NOME_CURSO_AGRUPADO_Agronomia',
    'NOME_CURSO_AGRUPADO_Análise E Desenvolvimento De Sistemas',
    'NOME_CURSO_AGRUPADO_Arquitetura E Urbanismo',
    'NOME_CURSO_AGRUPADO_Artes Visuais',
    'NOME_CURSO_AGRUPADO_Biomedicina',
    'NOME_CURSO_AGRUPADO_Ciência Da Computação',
    'NOME_CURSO_AGRUPADO_Ciências Biológicas',
    'NOME_CURSO_AGRUPADO_Ciências Contábeis',
    'NOME_CURSO_AGRUPADO_Ciências Contábeis (Ead)',
    'NOME_CURSO_AGRUPADO_Ciências Econômicas',
    'NOME_CURSO_AGRUPADO_Comunicação Social',
    'NOME_CURSO_AGRUPADO_Comunicação Social - Jornalismo',
    'NOME_CURSO_AGRUPADO_Comunicação Social - Publicidade E Propaganda',
    'NOME_CURSO_AGRUPADO_Comunicação Social Com Habilitação Em Jornalismo',
    'NOME_CURSO_AGRUPADO_Comunicação Social Com Habilitação Em Publicidade E Propaganda',
    'NOME_CURSO_AGRUPADO_Comércio Exterior',
    'NOME_CURSO_AGRUPADO_Curso Superior De Tecnologia Em Análise E Desenvolvimento De Sistemas',
    'NOME_CURSO_AGRUPADO_Curso Superior De Tecnologia Em Gastronomia',
    'NOME_CURSO_AGRUPADO_Curso Superior De Tecnologia Em Gestão De Recursos Humanos',
    'NOME_CURSO_AGRUPADO_Curso Superior De Tecnologia Em Gestão De Recursos Humanos (Área Profissional: Gestão)',
    'NOME_CURSO_AGRUPADO_Curso Superior De Tecnologia Em Gestão De Recursos Humanos(Ead)',
    'NOME_CURSO_AGRUPADO_Curso Superior De Tecnologia Em Logística',
    'NOME_CURSO_AGRUPADO_Curso Superior De Tecnologia Em Processos Gerenciais',
    'NOME_CURSO_AGRUPADO_Design',
    'NOME_CURSO_AGRUPADO_Design De Interiores',
    'NOME_CURSO_AGRUPADO_Design De Moda',
    'NOME_CURSO_AGRUPADO_Design Gráfico',
    'NOME_CURSO_AGRUPADO_Direito',
    'NOME_CURSO_AGRUPADO_Educaçao Física',
    'NOME_CURSO_AGRUPADO_Educação Física',
    'NOME_CURSO_AGRUPADO_Enfermagem',
    'NOME_CURSO_AGRUPADO_Engenharia',
    'NOME_CURSO_AGRUPADO_Engenharia Ambiental',
    'NOME_CURSO_AGRUPADO_Engenharia Ambiental E Sanitária',
    'NOME_CURSO_AGRUPADO_Engenharia Civil',
    'NOME_CURSO_AGRUPADO_Engenharia Com Habilitação Em Engenharia Mecânica',
    'NOME_CURSO_AGRUPADO_Engenharia Da Computação',
    'NOME_CURSO_AGRUPADO_Engenharia De Computação',
    'NOME_CURSO_AGRUPADO_Engenharia De Controle E Automação',
    'NOME_CURSO_AGRUPADO_Engenharia De Produção',
    'NOME_CURSO_AGRUPADO_Engenharia Elétrica',
    'NOME_CURSO_AGRUPADO_Engenharia Mecânica',
    'NOME_CURSO_AGRUPADO_Engenharia Química',
    'NOME_CURSO_AGRUPADO_Estética E Cosmética',
    'NOME_CURSO_AGRUPADO_Farmácia',
    'NOME_CURSO_AGRUPADO_Filosofia',
    'NOME_CURSO_AGRUPADO_Fisioterapia',
    'NOME_CURSO_AGRUPADO_Fonoaudiologia',
    'NOME_CURSO_AGRUPADO_Gastronomia',
    'NOME_CURSO_AGRUPADO_Geografia',
    'NOME_CURSO_AGRUPADO_Gestão Ambiental',
    'NOME_CURSO_AGRUPADO_Gestão Comercial',
    'NOME_CURSO_AGRUPADO_Gestão Da Qualidade',
    'NOME_CURSO_AGRUPADO_Gestão Da Tecnologia Da Informação',
    'NOME_CURSO_AGRUPADO_Gestão De Recursos Humanos',
    'NOME_CURSO_AGRUPADO_Gestão De Serviços Jurídicos E Notariais',
    'NOME_CURSO_AGRUPADO_Gestão Financeira',
    'NOME_CURSO_AGRUPADO_Gestão Hospitalar',
    'NOME_CURSO_AGRUPADO_Gestão Pública',
    'NOME_CURSO_AGRUPADO_História',
    'NOME_CURSO_AGRUPADO_Jogos Digitais',
    'NOME_CURSO_AGRUPADO_Jornalismo',
    'NOME_CURSO_AGRUPADO_Jornalismo - Jornalismo',
    'NOME_CURSO_AGRUPADO_Letras',
    'NOME_CURSO_AGRUPADO_Letras (Ead)',
    'NOME_CURSO_AGRUPADO_Letras - Inglês',
    'NOME_CURSO_AGRUPADO_Letras - Língua Portuguesa',
    'NOME_CURSO_AGRUPADO_Letras - Português',
    'NOME_CURSO_AGRUPADO_Letras - Português E Inglês',
    'NOME_CURSO_AGRUPADO_Logística',
    'NOME_CURSO_AGRUPADO_Marketing',
    'NOME_CURSO_AGRUPADO_Matemática',
    'NOME_CURSO_AGRUPADO_Medicina',
    'NOME_CURSO_AGRUPADO_Medicina Veterinária',
    'NOME_CURSO_AGRUPADO_Normal Superior',
    'NOME_CURSO_AGRUPADO_Nutrição',
    'NOME_CURSO_AGRUPADO_OUTROS_CURSOS',
    'NOME_CURSO_AGRUPADO_Odontologia',
    'NOME_CURSO_AGRUPADO_Pedagogia',
    'NOME_CURSO_AGRUPADO_Pedagogia (Ead) - Fian',
    'NOME_CURSO_AGRUPADO_Pedagogia (Ed)',
    'NOME_CURSO_AGRUPADO_Pedagogia(Ead)',
    'NOME_CURSO_AGRUPADO_Processos Gerenciais',
    'NOME_CURSO_AGRUPADO_Psicologia',
    'NOME_CURSO_AGRUPADO_Publicidade E Propaganda',
    'NOME_CURSO_AGRUPADO_Publicidade E Propaganda - Publicidade E Propaganda',
    'NOME_CURSO_AGRUPADO_Química',
    'NOME_CURSO_AGRUPADO_Radiologia',
    'NOME_CURSO_AGRUPADO_Redes De Computadores',
    'NOME_CURSO_AGRUPADO_Relações Internacionais',
    'NOME_CURSO_AGRUPADO_Segurança No Trabalho',
    'NOME_CURSO_AGRUPADO_Serviço Social',
    'NOME_CURSO_AGRUPADO_Serviço Social (Ead)',
    'NOME_CURSO_AGRUPADO_Sistema De Informação',
    'NOME_CURSO_AGRUPADO_Sistemas De Informação',
    'NOME_CURSO_AGRUPADO_Sistemas Para Internet',
    'NOME_CURSO_AGRUPADO_Teologia',
    'SEXO_BENEFICIARIO_BOLSA_F',
    'SEXO_BENEFICIARIO_BOLSA_M',
    'STATUS_DEFICIENCIA_TEXT_Não',
    'STATUS_DEFICIENCIA_TEXT_Sim'
]

def carregar_recursos_ia():
    """Carrega o modelo treinado e os recursos auxiliares."""
    global MODELO_DE_IA, COLUNAS_ESPERADAS, TOP_IES, TOP_CURSOS
    
    if MODELO_DE_IA is None:
        try:
            MODELO_DE_IA = joblib.load(MODELO_PATH) 
            COLUNAS_ESPERADAS = joblib.load(COLUNAS_PATH) 
            TOP_IES = joblib.load(IES_PATH) 
            TOP_CURSOS = joblib.load(CURSO_PATH) 
            
            # Checagem de integridade (opcional, mas recomendado)
            if hasattr(MODELO_DE_IA, 'n_features_in_') and len(COLUNAS_ESPERADAS) != MODELO_DE_IA.n_features_in_:
                raise Exception(
                    f"Inconsistência de Features: Colunas Esperadas ({len(COLUNAS_ESPERADAS)}) != Modelo ({MODELO_DE_IA.n_features_in_})."
                )

            print("✅ Recursos de IA carregados com sucesso!")
        except FileNotFoundError as e:
            raise Exception(f"Arquivo de recurso de IA não encontrado: {e}. Certifique-se de ter os arquivos PKL na pasta correta.")
        except Exception as e:
            raise Exception(f"Erro ao carregar o modelo ou recursos de IA. Detalhe: {e}")

    return MODELO_DE_IA

# Garante que o modelo seja carregado quando o módulo for importado
try:
    carregar_recursos_ia() 
except Exception as e:
    # A exceção será propagada se o carregamento falhar, mas o código continua para análise
    print(f"Erro de carregamento inicial: {e}") 

def pre_processar_features(features: Dict[str, Any]) -> pd.DataFrame:
    """
    Transforma o dicionário de features no formato DataFrame esperado pelo modelo (OHE),
    garantindo que o número de colunas seja EXATO (175).
    """
    global COLUNAS_ESPERADAS, TOP_IES, TOP_CURSOS
    
    # Garantir que os recursos estejam carregados antes de usar as globais
    if COLUNAS_ESPERADAS is None or TOP_IES is None or TOP_CURSOS is None:
         carregar_recursos_ia() 
         
    # 1. Lista de EXATAMENTE as 10 features de entrada
    colunas_de_entrada = [
        'IDADE', 
        'SEXO_BENEFICIARIO_BOLSA', 'STATUS_DEFICIENCIA_TEXT', 
        'RACA_BENEFICIARIO_BOLSA', 'REGIAO_BENEFICIARIO_BOLSA', 
        'MODALIDADE_ENSINO_BOLSA', 'NOME_TURNO_CURSO_BOLSA', 
        'MODALIDADE_CONCORRENCIA', # Mantida na entrada raw
        'NOME_IES_BOLSA', 'NOME_CURSO_BOLSA'
    ]
    
    # 2. Cria DataFrame e Seleciona Apenas as 10 Features
    try:
        df = pd.DataFrame([features])[colunas_de_entrada]
    except KeyError as e:
        raise Exception(f"A feature essencial {e} está faltando no dicionário de entrada.")

    # 3. Tratamento de Nulos e Coerção
    df['IDADE'] = pd.to_numeric(df['IDADE'], errors='coerce').fillna(0)
    cols_categoricas_raw = colunas_de_entrada[1:]
    for col in cols_categoricas_raw:
        # Garante que nulos/tipos estranhos sejam tratados como uma categoria 'NA_DB'
        df[col] = df[col].astype(str).str.upper().replace(['NAN', 'NONE', 'NONETYPE', 'NONE', 'NONETYPE', 'nan'], 'NA_DB').fillna('NA_DB')
        
    # 4. Agrupamento Top-N
    df['NOME_IES_AGRUPADO'] = df['NOME_IES_BOLSA'].apply(
        lambda x: x if x in TOP_IES else 'OUTRAS_IES'
    )
    df['NOME_CURSO_AGRUPADO'] = df['NOME_CURSO_BOLSA'].apply(
        lambda x: x if x in TOP_CURSOS else 'OUTROS_CURSOS'
    )
    
    # 5. Drop das colunas RAW originais e da coluna MODALIDADE_CONCORRENCIA (CRÍTICO!)
    # Dropamos as colunas RAW e a MODALIDADE_CONCORRENCIA (9ª feature categórica)
    # porque ela não deve ser OHE e não faz parte das 175 features finais.
    df_processado = df.drop(
        columns=['NOME_IES_BOLSA', 'NOME_CURSO_BOLSA', 'MODALIDADE_CONCORRENCIA'], 
        errors='ignore'
    )

    # 6. Codificação (OHE) - APENAS AS 8 FEATURES USADAS NO TREINAMENTO
    colunas_para_ohe = [
        'SEXO_BENEFICIARIO_BOLSA', 
        'STATUS_DEFICIENCIA_TEXT', 
        'RACA_BENEFICIARIO_BOLSA', 
        'REGIAO_BENEFICIARIO_BOLSA', 
        'MODALIDADE_ENSINO_BOLSA', 
        'NOME_TURNO_CURSO_BOLSA', 
        'NOME_IES_AGRUPADO', 
        'NOME_CURSO_AGRUPADO'               
    ]
    
    # Aplica a codificação OHE (A IDADE fica de fora do OHE por ser numérica)
    df_encoded = pd.get_dummies(
        df_processado, 
        columns=colunas_para_ohe, 
        dtype=int, 
        drop_first=False, 
        dummy_na=False 
    ) 
    
    # 7. Alinhamento Crítico de Colunas (reindex para 175 features)
    # Garante que o DataFrame final tenha exatamente 175 colunas na ordem correta, 
    # preenchendo colunas ausentes com 0.
    df_final = df_encoded.reindex(columns=COLUNAS_ESPERADAS, fill_value=0)
    
    # Verificação final 
    if df_final.shape[1] != len(COLUNAS_ESPERADAS):
        colunas_extras = list(set(df_final.columns) - set(COLUNAS_ESPERADAS))
        colunas_faltando = list(set(COLUNAS_ESPERADAS) - set(df_final.columns))
        raise Exception(
            f"ERRO CRÍTICO FINAL: Esperado {len(COLUNAS_ESPERADAS)} colunas, encontrado {df_final.shape[1]}. "
            f"Colunas Extras: {colunas_extras}. Colunas Faltando: {colunas_faltando}"
        )

    # 8. ✅ CORREÇÃO para o UserWarning: Retorna o DataFrame (com feature names)
    return df_final

def classificar_bolsa(dados_candidato: Dict[str, Any]) -> str:
    """
    Realiza a predição da bolsa (Integral/Parcial) usando o modelo de IA.
    """
    try:
        modelo = MODELO_DE_IA
        
        # vetor_features agora é um DataFrame com feature names
        vetor_features = pre_processar_features(dados_candidato)
        
        # Realiza a predição. O Scikit-learn aceita o DataFrame diretamente,
        # resolvendo o UserWarning.
        predicao = modelo.predict(vetor_features)[0]
        
        # Converte a saída
        return "Bolsa Integral" if predicao == 1 else "Bolsa Parcial"
        
    except Exception as e:
        print(f"⚠️ Erro crítico na predição da IA. Detalhe: {e}")
        # Retorna o padrão
        return "Bolsa Parcial"