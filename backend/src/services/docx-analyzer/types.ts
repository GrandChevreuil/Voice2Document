// Interfaces pour l'analyse docx

export interface ZoneVide {
  title: string;
  placeholder: string;
  position: number;
  level: 'C1' | 'Titre1' | 'TableCell';
  parent: string | null;
  paraId?: string;
  tableContext?: {
    tableIndex: number;
    rowIndex: number;
    colIndex: number;
    headerRow?: string[];
  };
}

export interface FormatReponse {
  type: string;
  json_schema: {
    name: string;
    strict: boolean;
    schema: {
      type: string;
      properties: Record<string, { type: string; description: string }>;
      required: string[];
      additionalProperties: boolean;
    };
  };
}

export interface DocumentParse {
  xmlParse: any;
  tagsExistants: Set<string>;
  espacesNoms?: any;
}
