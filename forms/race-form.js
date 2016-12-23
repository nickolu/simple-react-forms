import React from 'react';
import raceData from '../../json/races.json';
import * as utilities from "../utilities.js";
import { DropDown } from '../form-fields/drop-down.js';
import { TextInput } from '../form-fields/text-input.js';
import { CheckBoxGroup } from '../form-fields/checkbox-group.js';
import { SubmitButton } from '../form-fields/submit-button.js';
import { SkillsForm } from './skills-form.js';

export class RaceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.setLanguageChoice = this.setLanguageChoice.bind(this);
    this.setDraconicAncestry = this.setDraconicAncestry.bind(this);
    this.skillsForm = new SkillsForm(props);
  };

  onChange(e) {
    this.setState({
      race : document.querySelector('[name=select_race]').value,
    });

    //this.resetRaceData();
    this.skillsForm.setSkillChoices(e);
    this.props.onUpdate(e);
  }

  setLanguageChoice(e) {
    let languageElems = document.querySelectorAll('[name=select_extra_language]') || [];
    let l = languageElems.length;
    let index = 0;
    let i = 0;

    this.props.charData.selected_languages = this.props.charData.selected_languages || [];
    this.props.charData.proficiencies = this.props.charData.proficiencies || {};
    this.props.charData.proficiencies.languages = this.props.charData.proficiencies.languages || [];

    if (l > 0) {
      for (i=0; i<l; i += 1) {
          this.props.charData.selected_languages.push(languageElems[i].value)
          this.props.charData.proficiencies.languages.push(languageElems[i].value);
      }
    } else {
      if (this.props.charData.selected_languages) {
        l = this.props.charData.selected_languages.length;
        for (i=0; i<l; i+=1) {
          index = this.props.charData.proficiencies.languages.indexOf(this.props.charData.selected_languages[i]);
          if (index > -1) {
            this.props.charData.proficiencies.languages.splice(index, 1);
          }
          this.props.charData.proficiencies.languages.push('choice');
        }
      }
      this.props.charData.selected_languages = [];
    }

    this.props.onUpdate(e);
  }

  resetRaceData(e) {
    this.props.charData.proficiencies = {}
    this.props.charData.selected_languages = [];
    this.props.charData.feats = [];
    if (e && e.target && e.target.getAttribute('name') === "select_race") {
        this.props.charData.ability_score_increase = {};
    }
  }

  getRaceNames() {
    let raceNames = [];
    let race = "";

    for (race in raceData) {
      raceNames.push(raceData[race])
    }

    return raceNames;
  }

  setDraconicAncestry(e) {
    let i = 0;
    let l = 0;

    if (this.props.charData) {
      this.props.charData.feats = this.props.charData.feats || [];
      l = this.props.charData.feats.length;

      for (i = 0; i < l; i+= 1) {
        if (this.props.charData.feats && this.props.charData.feats[i] && this.props.charData.feats[i].indexOf("draconic_ancestry_") > -1) {
          this.props.charData.feats.splice(i, 1)
        }
      }

      this.props.charData.feats.push("draconic_ancestry_"+e.target.value.toLowerCase());
    }

    this.props.onUpdate(e);
  }

  getDraconicAncestryForm(thisRaceData) {
    let raceName = this.props.charData.select_race;
    let draconicAncestryForm = "";
    let draconicAncestryChoices = [];
    let item = "";

    if (raceName === "Dragonborn") {

      for (item in thisRaceData.draconic_ancestry) {
        draconicAncestryChoices.push({
          id : thisRaceData.draconic_ancestry[item].name,
          label : thisRaceData.draconic_ancestry[item].name+" | "+thisRaceData.draconic_ancestry[item].damage_type+" | "+thisRaceData.draconic_ancestry[item].breath_weapon,
          name : thisRaceData.draconic_ancestry[item].name
        });
      }
      return <DropDown name="select_draconic_ancestry" className="select-race" label="Select Draconic Ancestry" choices={draconicAncestryChoices} onUpdate={this.setDraconicAncestry}/>;
    }

    return false;
  }

  getAbilityScoreChoiceForm (thisRaceData) {
    let raceName = this.props.charData.select_race;
    let abilityScores = [
      {label : "Strength", name : "ability_score_increase_str", value : 1, id : "str"},
      {label : "Constitution", name : "ability_score_increase_con", value : 1, id : "con"},
      {label : "Dexterity", name : "ability_score_increase_dex", value : 1, id : "dex"},
      {label : "Wisdom", name : "ability_score_increase_wis", value : 1, id : "wis"},
      {label : "Intelligence", name : "ability_score_increase_int", value : 1, id : "int"}
    ];

    if (raceName === "Half-Elf") {
      return <CheckBoxGroup name="half_elf_abilities" label="Select Abilities" choices={abilityScores} groupLabel="Select Two Abilities" groupName="halfelf_ability_score" optionsLimit={thisRaceData.ability_score_choices} onUpdate={this.props.onUpdate} />;
    }
  }

  getLanguageChoiceForm (thisRaceData) {
    let raceName = this.props.charData.select_race;
    let subRaceName = this.props.charData.select_subrace;
    let thisSubRaceData = utilities.getObjectByName(thisRaceData.subraces,subRaceName);;
    let languageChoiceForm = "";
    let raceIndex = 0;
    let subraceIndex = 0;

    if (thisRaceData) {
      raceIndex = thisRaceData.proficiencies.languages.indexOf("choice")
      if (thisRaceData.proficiencies.languages && raceIndex > -1) {
        languageChoiceForm = <div><TextInput type="text" label="Extra Language" name="select_extra_language" /><SubmitButton label="Choose" onUpdate={this.setLanguageChoice} /></div>
      } else if (this.props.charData && this.props.charData.proficiences && this.props.charData.proficiences.languages && this.props.charData.proficiences.languages.indexOf('choice') > -1) {
        languageChoiceForm = <div><TextInput type="text" label="Extra Language" name="select_extra_language" /><SubmitButton label="Choose" onUpdate={this.setLanguageChoice} /></div>
      }

      if (thisSubRaceData && thisSubRaceData.proficiencies && thisSubRaceData.proficiencies.languages) {
        subraceIndex = thisSubRaceData.proficiencies.languages.indexOf("choice");
        if (subraceIndex > -1) {
          languageChoiceForm = <div><TextInput type="text" label="Extra Language" name="select_extra_language" /><SubmitButton label="Choose" onUpdate={this.setLanguageChoice} /></div>
        }
      }

      if (this.props.charData.selected_languages && this.props.charData.selected_languages.length > 0) {
        languageChoiceForm = <div><SubmitButton label="Choose a different language" onUpdate={this.setLanguageChoice} /></div>
      }
    }

    return languageChoiceForm
  }

  getSubraceForm(thisRaceData) {
    let raceName = this.props.charData.select_race;
    let subRaceName = this.props.charData.select_subrace;
    let thisSubRaceData = utilities.getObjectByName(thisRaceData.subraces,subRaceName);;
    let subraces = thisRaceData.subraces;
    let subRaceForm = "";

    if (thisRaceData) {
      if (subraces && subraces.length) {
        subRaceForm = <DropDown name="select_subrace" label="Select Subrace" choices={subraces} onUpdate={this.props.onUpdate}/>;
      }
    }

    return subRaceForm;
  }

  getThisRaceData() {
    let raceName = this.props.charData.select_race;
    let thisRaceData = utilities.getObjectByName(raceData,raceName);

    return thisRaceData;
  }

  render() {
    let thisRaceData = this.getThisRaceData();

    return  <div className="form-field race-form">
              <h2>Race</h2>
              <DropDown name="select_race" className="select-race" label="Select Race" choices={this.getRaceNames()} onUpdate={this.onChange}/>
              {this.getSubraceForm(thisRaceData)}
              {this.getLanguageChoiceForm(thisRaceData)}
              {this.getAbilityScoreChoiceForm(thisRaceData)}
              {this.getDraconicAncestryForm(thisRaceData)}
            </div>
  }

}
