export type HouseDiagramProps = {
  /** Accessible description of the illustration. */
  label?: string
  showLegend?: boolean
}

/** Cut-away house showing how ducts, wiring and pipes share one structure. */
export function HouseDiagram({
  label = 'House cross-section showing heating ducts, electrical wiring and plumbing',
  showLegend = true,
}: HouseDiagramProps) {
  return (
    <figure className="house-diagram">
      <svg className="house-diagram__svg" viewBox="0 0 420 310" role="img" aria-label={label}>
        {/* structure */}
        <path className="house-diagram__frame" d="M18 128 L210 18 L402 128" />
        <path className="house-diagram__frame" d="M52 108 V268 M368 108 V268" />
        <path className="house-diagram__ground" d="M0 268 H420" />

        {/* HVAC ducts */}
        <path className="house-diagram__duct" d="M102 214 V150 H292 V98" />
        <path className="house-diagram__duct" d="M102 184 H260" />
        <path className="house-diagram__duct" d="M292 150 H340" />

        {/* electrical */}
        <path className="house-diagram__wire" d="M352 214 V62 H258" />
        <path className="house-diagram__wire" d="M352 118 H322" />
        <circle className="house-diagram__node-wire" cx="258" cy="62" r="5" />
        <circle className="house-diagram__node-wire" cx="322" cy="118" r="5" />

        {/* plumbing */}
        <path className="house-diagram__pipe" d="M214 204 V112 H150" />
        <path className="house-diagram__pipe" d="M214 160 H306 V126" />
        <circle className="house-diagram__node-pipe" cx="150" cy="112" r="5" />
        <circle className="house-diagram__node-pipe" cx="306" cy="126" r="5" />

        {/* equipment */}
        <rect className="house-diagram__unit house-diagram__unit--furnace" x="68" y="214" width="68" height="48" rx="3" />
        <text className="house-diagram__label" x="102" y="242" fill="#d9dee3">
          Furnace
        </text>
        <rect className="house-diagram__unit house-diagram__unit--heater" x="192" y="204" width="44" height="58" rx="12" />
        <text className="house-diagram__label" x="214" y="288" fill="#6cb2e8">
          Water heater
        </text>
        <rect className="house-diagram__unit house-diagram__unit--panel" x="336" y="214" width="32" height="48" rx="2" />
        <text className="house-diagram__label" x="352" y="288" fill="#e8803a">
          Panel
        </text>
      </svg>

      {showLegend && (
        <ul className="legend list-reset" aria-hidden="true">
          <li className="legend__item">
            <span className="legend__swatch legend__swatch--duct" />
            HVAC ducts
          </li>
          <li className="legend__item">
            <span className="legend__swatch legend__swatch--wire" />
            Electrical
          </li>
          <li className="legend__item">
            <span className="legend__swatch legend__swatch--pipe" />
            Plumbing
          </li>
        </ul>
      )}
    </figure>
  )
}
