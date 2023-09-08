import {useState} from "react";

export type Alignment = 'left' | 'right' | 'center';

interface TabsBulmaProps {
  choices: string[],
  value: number;
  alignment?: Alignment,
  onChange?: ([value, index]:[string, number]) => void
}

const TabsBulma:React.FC<TabsBulmaProps> = ({choices, value, alignment, onChange}) => {
  // const [activeIndex, setActiveIndex] = useState<number>(defaultChoice);

  const handleTabClick = (index: number) => {
    // setActiveIndex(index);

    if (onChange) {
      onChange([choices[index], index]);
    }
  }

  return (
    <div className="tabs is-right">
      <ul>
        {(choices && choices.length > 0) &&
            choices.map((choice, index) => {
              return <li key={index} className={index === value ? "is-active" : ""}>
                <a id={choice} onClick={e => handleTabClick(index)}>
                  {choice}
                </a>
              </li>;
            })
        }
      </ul>
    </div>
  )
}

export default TabsBulma;