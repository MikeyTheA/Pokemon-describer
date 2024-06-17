const requiredVersion = '1.0.2';

const Nature = ['HARDY', 'LONELY', 'BRAVE', 'ADAMANT', 'NAUGHTY', 'BOLD', 'DOCILE', 'RELAXED', 'IMPISH', 'LAX', 'TIMID', 'HASTY', 'SERIOUS', 'JOLLY', 'NAIVE', 'MODEST', 'MILD', 'QUIET', 'BASHFUL', 'RASH', 'CALM', 'GENTLE', 'SASSY', 'CAREFUL', 'QUIRKY'];
const Stat = ['HP', 'ATK', 'DEF', 'SPATK', 'SPDEF', 'SPD'];

describePokemon = (pokemon) => {
    ImGui.Text(`Id: ${pokemon.id}`);
    ImGui.Text(`Shiny: ${pokemon.shiny}`);
    ImGui.Text(`Level: ${pokemon.level}`);
    if (pokemon.gender === -1) {
        ImGui.Text(`Gender: genderless`);
    } else {
        ImGui.Text(`Gender: ${pokemon.gender === 0 ? 'Male' : 'Female'}`);
    }
    ImGui.Text(`Health: ${pokemon.hp}`);

    if (ImGui.TreeNode(`stats##${pokemon.id}`)) {
        pokemon.stats.forEach((stat, statindex) => {
            ImGui.Text(`${Stat[statindex]}: ${stat}`);
        });
        ImGui.TreePop();
    }

    if (ImGui.TreeNode(`ivs##${pokemon.id}`)) {
        pokemon.ivs.forEach((iv, ivindex) => {
            ImGui.Text(`${Stat[ivindex]}: ${iv}`);
        });
        ImGui.TreePop();
    }

    if (ImGui.TreeNode(`moveset##${pokemon.id}`)) {
        pokemon.getMoveset().forEach((move) => {
            ImGui.Text(move.getMove().name);
        });
        ImGui.TreePop();
    }
    ImGui.Text(`passive: ${pokemon.passive}`);
    ImGui.Text(`luck: ${pokemon.luck}`);
    ImGui.Text(`Level: ${pokemon.level}`);

    ImGui.Text(`Nature: ${Nature[pokemon.getNature()]}`);
    if (ImGui.TreeNode(`${pokemon.species.getName()}##species${pokemon.id}`)) {
        ImGui.Text(`generation: ${pokemon.species.generation}`);
        ImGui.Text(`sub-legendary: ${pokemon.species.subLegendary}`);
        ImGui.Text(`legendary: ${pokemon.species.legendary}`);
        ImGui.Text(`mythical: ${pokemon.species.mythical}`);
        ImGui.Text(`growth rate: ${pokemon.species.growthRate}`);
        ImGui.Text(`male: ${pokemon.species.malePercent}%`);
        ImGui.Text(`gender diffs: ${pokemon.species.genderDiffs}`);
        ImGui.Text(`can change form: ${pokemon.species.canChangeForm}`);
        ImGui.Text(`obtainable: ${pokemon.species.isObtainable()}`);

        if (ImGui.TreeNode(`forms##${pokemon.id}`)) {
            pokemon.species.forms.forEach((form) => {
                ImGui.Text(`${form.name}`);
            });
            ImGui.TreePop();
        }

        if (ImGui.TreeNode(`prevolution levels##${pokemon.id}`)) {
            pokemon.species.getPrevolutionLevels().forEach((ev) => {
                ImGui.Text(`${ev[1]}`);
            });
            ImGui.TreePop();
        }

        if (ImGui.TreeNode(`evolution levels##${pokemon.id}`)) {
            pokemon.species.getEvolutionLevels().forEach((ev) => {
                ImGui.Text(`${ev[1]}`);
            });
            ImGui.TreePop();
        }

        ImGui.TreePop();
    }
};

addWindow(
    'Pokemon describer',
    () => {
        if (compareVersions(currentVersion, requiredVersion) < 0) {
            ImGui.Text('Outdated PokeRogueModLoader!');
            ImGui.Text(`Update to ${requiredVersion}`);
            ImGui.Text(`You are using ${currentVersion}`);
            return;
        }

        const battleScene = getBattleScene();

        if (!battleScene || typeof battleScene.getParty !== 'function') {
            ImGui.Text('Game is still loading');
        }

        battleScene.getParty().forEach((pokemon, index) => {
            ImGui.PushStyleColor(ImGui.ImGuiCol.Text, ImGui.IM_COL32(0, 255, 0, 255));
            if (ImGui.CollapsingHeader(`${pokemon.name}##${pokemon.id}`)) {
                ImGui.PopStyleColor();
                describePokemon(pokemon);
            } else {
                ImGui.PopStyleColor();
            }
        });

        battleScene.getEnemyParty().forEach((pokemon, index) => {
            ImGui.PushStyleColor(ImGui.ImGuiCol.Text, ImGui.IM_COL32(255, 0, 0, 255));
            if (ImGui.CollapsingHeader(`${pokemon.name}##${pokemon.id}`)) {
                ImGui.PopStyleColor();
                describePokemon(pokemon);
            } else {
                ImGui.PopStyleColor();
            }
        });
    },
    {
        persistentOpen: true,
    }
);
