// Diagrama clínico do pavilhão auricular direito (vista frontal)
// Traçado anatômico baseado em referência de sketch humano
// Coordenadas no espaço SVG 0 0 100 155
export default function OrelhaBase() {
  return (
    <g>
      <defs>
        {/* Gradiente cavum conchae — zona mais profunda */}
        <radialGradient id="cavumGrad" cx="40%" cy="44%" r="64%">
          <stop offset="0%" stopColor="#B8821A" />
          <stop offset="100%" stopColor="#7A5008" />
        </radialGradient>
        {/* Gradiente cymba conchae */}
        <radialGradient id="cymbaGrad" cx="48%" cy="36%" r="58%">
          <stop offset="0%" stopColor="#CC9A26" />
          <stop offset="100%" stopColor="#9A7018" />
        </radialGradient>
        {/* Gradiente fossa triangular */}
        <radialGradient id="fossaGrad" cx="44%" cy="44%" r="62%">
          <stop offset="0%" stopColor="#C89A30" />
          <stop offset="100%" stopColor="#9A7420" />
        </radialGradient>
        {/* Sombra suave */}
        <filter id="earShadow" x="-10%" y="-5%" width="128%" height="118%">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5" floodColor="rgba(70,35,0,0.24)" />
        </filter>
      </defs>

      {/* ══ 1. Silhueta principal (pele base) ══ */}
      <path
        d="M44,7
           C52,4 62,7 70,14
           C78,21 83,32 85,44
           C87,55 87,66 86,76
           C85,86 83,96 80,106
           C77,114 74,121 70,128
           C65,134 59,139 52,144
           C47,147 42,150 37,150
           C32,151 27,149 23,145
           C19,140 16,133 14,124
           C12,115 11,105 10,96
           C9,87 9,78 10,69
           C11,61 13,53 16,46
           C19,38 23,30 28,23
           C33,15 39,9 43,8
           C43,7 44,7 44,7Z"
        fill="#EDD6B0"
        stroke="#7A4E18"
        strokeWidth="1.0"
        filter="url(#earShadow)"
      />

      {/* ══ 2. Borda da hélice — aba externa clara (a dobra do rim) ══ */}
      {/* Faixa mais clara que reveste o interior da curva externa do helix */}
      <path
        d="M44,7
           C51,5 61,8 68,15
           C76,22 80,33 82,44
           C83,55 83,65 82,75
           C81,85 79,95 77,104
           C74,112 71,119 67,125
           C62,131 57,136 52,139
           L37,150
           C42,150 47,147 52,144
           C59,139 65,134 70,128
           C74,121 77,114 80,106
           C83,96 85,86 86,76
           C87,66 87,55 85,44
           C83,32 78,21 70,14
           C62,7 52,4 44,7Z"
        fill="#F3E5CB"
        stroke="none"
      />

      {/* ══ 3. Linha de dobra da hélice (detalhe ESSENCIAL — cria o rim visível) ══ */}
      {/* Linha paralela à silhueta externa, ~8 unidades para dentro */}
      <path
        d="M44,9
           C51,7 60,10 67,17
           C75,24 79,35 80,47
           C81,58 80,68 79,78
           C77,88 74,97 72,105
           C69,112 66,119 63,124"
        fill="none"
        stroke="#8B5E20"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ══ 4. Lóbulo (tecido mole inferior) ══ */}
      <path
        d="M14,124
           C13,130 13,137 16,143
           C19,148 25,151 35,152
           C45,152 53,149 57,144
           C61,139 61,133 57,129
           C51,132 44,134 37,134
           C29,134 22,131 18,128Z"
        fill="#F0E2C0"
        stroke="#7A4E18"
        strokeWidth="0.6"
      />

      {/* ══ 5. Cavum conchae (concha principal — mais profunda e escura) ══ */}
      <path
        d="M12,88
           C13,80 18,74 26,71
           C33,68 42,69 48,73
           C54,77 58,84 59,92
           C60,100 57,109 51,114
           C44,118 35,118 27,114
           C20,110 13,102 12,95Z"
        fill="url(#cavumGrad)"
        stroke="#7A4E18"
        strokeWidth="0.35"
      />

      {/* ══ 6. Cymba conchae (concha superior) ══ */}
      <path
        d="M36,70
           C38,65 43,63 48,63
           C52,63 56,65 58,69
           C60,74 59,80 57,85
           C54,90 50,92 46,91
           C41,90 37,86 36,81
           C35,77 35,73 36,70Z"
        fill="url(#cymbaGrad)"
        stroke="#7A4E18"
        strokeWidth="0.3"
      />

      {/* ══ 7. Canal auditivo externo ══ */}
      <ellipse
        cx="22" cy="97"
        rx="4.5" ry="6"
        fill="#5A3810"
        stroke="#3A2208"
        strokeWidth="0.3"
      />

      {/* ══ 8. Anti-hélice — corpo (crista central vertical) ══ */}
      <path
        d="M37,116
           C39,105 42,95 44,84
           C46,74 49,65 52,58
           C55,60 58,64 58,66
           C55,74 52,84 50,94
           C48,103 46,113 44,121Z"
        fill="#E8D9B0"
        stroke="#7A4E18"
        strokeWidth="0.75"
      />

      {/* ══ 9. Anti-hélice — crus superior (braço superior do Y, sobe à direita) ══ */}
      <path
        d="M52,58
           C55,53 59,49 64,46
           C69,43 74,41 79,41
           C83,41 86,42 87,46
           C84,49 80,50 75,50
           C70,50 65,51 60,54
           C56,57 53,61 52,63Z"
        fill="#E8D9B0"
        stroke="#7A4E18"
        strokeWidth="0.75"
      />

      {/* ══ 10. Anti-hélice — crus inferior (braço inferior do Y, vai para a direita) ══ */}
      <path
        d="M52,58
           C54,63 57,67 61,70
           C65,73 69,74 74,74
           C78,74 82,72 84,70
           C83,67 81,65 79,66
           C76,68 71,68 66,67
           C61,66 57,63 54,61Z"
        fill="#E8D9B0"
        stroke="#7A4E18"
        strokeWidth="0.75"
      />

      {/* ══ 11. Fossa triangular (depressão entre os dois crus) ══ */}
      <path
        d="M53,60
           C56,55 61,51 66,49
           C71,46 76,45 81,46
           C84,50 86,56 86,62
           C86,68 84,73 81,75
           C78,75 74,74 70,72
           C65,70 60,66 57,62Z"
        fill="url(#fossaGrad)"
        stroke="#7A4E18"
        strokeWidth="0.3"
      />

      {/* ══ 12. Tragus (projeção anterior, aba do meato) ══ */}
      <path
        d="M10,69
           C8,77 8,86 9,95
           C9,103 11,111 14,117
           C16,120 19,122 22,121
           C21,113 20,105 20,97
           C19,89 18,81 15,76Z"
        fill="#E6CA96"
        stroke="#7A4E18"
        strokeWidth="0.75"
      />

      {/* ══ 13. Anti-tragus (protuberância oposta) ══ */}
      <path
        d="M22,121
           C26,121 32,120 38,118
           C43,116 47,114 50,112
           C49,118 46,123 41,126
           C36,129 29,129 25,126
           C23,124 22,122 22,121Z"
        fill="#D4AE72"
        stroke="#7A4E18"
        strokeWidth="0.4"
      />

      {/* ══ 14. Incisura intertrágo (entalhe) ══ */}
      <path
        d="M14,117
           C16,120 19,121 22,121
           L22,120
           C19,120 16,119 14,117Z"
        fill="#AA8040"
        stroke="none"
      />

      {/* ══ 15. Contorno final (sobreposto, limpa a silhueta) ══ */}
      <path
        d="M44,7
           C52,4 62,7 70,14
           C78,21 83,32 85,44
           C87,55 87,66 86,76
           C85,86 83,96 80,106
           C77,114 74,121 70,128
           C65,134 59,139 52,144
           C47,147 42,150 37,150
           C32,151 27,149 23,145
           C19,140 16,133 14,124
           C12,115 11,105 10,96
           C9,87 9,78 10,69
           C11,61 13,53 16,46
           C19,38 23,30 28,23
           C33,15 39,9 43,8
           C43,7 44,7 44,7Z"
        fill="none"
        stroke="#7A4E18"
        strokeWidth="1.0"
      />
    </g>
  );
}
