var Nature = ['HARDY', 'LONELY', 'BRAVE', 'ADAMANT', 'NAUGHTY', 'BOLD', 'DOCILE', 'RELAXED', 'IMPISH', 'LAX', 'TIMID', 'HASTY', 'SERIOUS', 'JOLLY', 'NAIVE', 'MODEST', 'MILD', 'QUIET', 'BASHFUL', 'RASH', 'CALM', 'GENTLE', 'SASSY', 'CAREFUL', 'QUIRKY'];
var Stat = ['HP', 'ATK', 'DEF', 'SPATK', 'SPDEF', 'SPD'];
var describePokemon = function (pokemon) {
    ImGui.Text("Id: ".concat(pokemon.id));
    ImGui.Text("Shiny: ".concat(pokemon.shiny));
    ImGui.Text("Level: ".concat(pokemon.level));
    if (pokemon.gender === -1) {
        ImGui.Text("Gender: genderless");
    }
    else {
        ImGui.Text("Gender: ".concat(pokemon.gender === 0 ? 'Male' : 'Female'));
    }
    ImGui.Text("Health: ".concat(pokemon.hp));
    if (ImGui.TreeNode("stats##".concat(pokemon.id))) {
        pokemon.stats.forEach(function (stat, statindex) {
            ImGui.Text("".concat(Stat[statindex], ": ").concat(stat));
        });
        ImGui.TreePop();
    }
    if (ImGui.TreeNode("ivs##".concat(pokemon.id))) {
        pokemon.ivs.forEach(function (iv, ivindex) {
            ImGui.Text("".concat(Stat[ivindex], ": ").concat(iv));
        });
        ImGui.TreePop();
    }
    if (ImGui.TreeNode("moveset##".concat(pokemon.id))) {
        pokemon.getMoveset().forEach(function (move) {
            ImGui.Text(move.getMove().name);
        });
        ImGui.TreePop();
    }
    ImGui.Text("passive: ".concat(pokemon.passive));
    ImGui.Text("luck: ".concat(pokemon.luck));
    ImGui.Text("Level: ".concat(pokemon.level));
    ImGui.Text("Nature: ".concat(Nature[pokemon.getNature()]));
    if (ImGui.TreeNode("".concat(pokemon.species.getName(), "##species").concat(pokemon.id))) {
        ImGui.Text("generation: ".concat(pokemon.species.generation));
        ImGui.Text("sub-legendary: ".concat(pokemon.species.subLegendary));
        ImGui.Text("legendary: ".concat(pokemon.species.legendary));
        ImGui.Text("mythical: ".concat(pokemon.species.mythical));
        ImGui.Text("growth rate: ".concat(pokemon.species.growthRate));
        ImGui.Text("male: ".concat(pokemon.species.malePercent, "%"));
        ImGui.Text("gender diffs: ".concat(pokemon.species.genderDiffs));
        ImGui.Text("can change form: ".concat(pokemon.species.canChangeForm));
        ImGui.Text("obtainable: ".concat(pokemon.species.isObtainable()));
        if (ImGui.TreeNode("forms##".concat(pokemon.id))) {
            pokemon.species.forms.forEach(function (form) {
                ImGui.Text("".concat(form.formName));
            });
            ImGui.TreePop();
        }
        if (ImGui.TreeNode("prevolution levels##".concat(pokemon.id))) {
            pokemon.species.getPrevolutionLevels().forEach(function (ev) {
                ImGui.Text("".concat(ev[1]));
            });
            ImGui.TreePop();
        }
        if (ImGui.TreeNode("evolution levels##".concat(pokemon.id))) {
            pokemon.species.getEvolutionLevels().forEach(function (ev) {
                ImGui.Text("".concat(ev[1]));
            });
            ImGui.TreePop();
        }
        ImGui.TreePop();
    }
};
addWindow('Pokemon describer', function () {
    var battleScene = getBattleScene();
    if (!battleScene || typeof battleScene.getParty !== 'function') {
        ImGui.Text('Game is still loading');
        return;
    }
    battleScene.getParty().forEach(function (pokemon) {
        ImGui.PushStyleColor(ImGui.ImGuiCol.Text, ImGui.IM_COL32(0, 255, 0, 255));
        if (ImGui.CollapsingHeader("".concat(pokemon.name, "##").concat(pokemon.id))) {
            ImGui.PopStyleColor();
            describePokemon(pokemon);
        }
        else {
            ImGui.PopStyleColor();
        }
    });
    battleScene.getEnemyParty().forEach(function (pokemon) {
        ImGui.PushStyleColor(ImGui.ImGuiCol.Text, ImGui.IM_COL32(255, 0, 0, 255));
        if (ImGui.CollapsingHeader("".concat(pokemon.name, "##").concat(pokemon.id))) {
            ImGui.PopStyleColor();
            describePokemon(pokemon);
        }
        else {
            ImGui.PopStyleColor();
        }
    });
}, {
    persistentOpen: true,
});
