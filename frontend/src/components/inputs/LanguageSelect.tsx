import { Select } from "flowbite-react/components/Select";
import { Language } from "../../shared/interfaces/Language";
import { Label } from "flowbite-react/components/Label";

interface LanguageSelectProps {
  languages: Language[];
  label?: string;
  onChange: (language?: Language) => void;
  chosenLanguage?: Language;
}

export const LanguageSelect = ({
  languages,
  label,
  onChange,
  chosenLanguage,
}: LanguageSelectProps) => {
  return (
    <div>
      {label && (
        <div className="mb-2 block">
          <Label htmlFor={"languageSelect"} value={label} />
        </div>
      )}
      <Select
        id="languageSelect"
        required
        onChange={(event) => {
          const newLang = languages.find((language) => {
            return language.name === event.target.value;
          });
          onChange(newLang);
        }}
        value={chosenLanguage?.name}
      >
        {languages.map((language) => {
          return <option key={language.name}>{language.name}</option>;
        })}
      </Select>
    </div>
  );
};
