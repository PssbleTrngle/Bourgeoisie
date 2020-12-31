package com.possible_triangle.command;

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.builder.ArgumentBuilder;
import com.mojang.brigadier.builder.LiteralArgumentBuilder;
import com.mojang.brigadier.builder.RequiredArgumentBuilder;
import com.mojang.brigadier.context.CommandContext;
import com.mojang.brigadier.exceptions.CommandSyntaxException;
import com.possible_triangle.Bourgeoisie;
import net.minecraft.commands.CommandSource;
import net.minecraft.commands.CommandSourceStack;
import net.minecraft.commands.Commands;
import net.minecraft.commands.arguments.EntityArgument;
import net.minecraft.world.entity.player.Player;

public class BourgeoisieCommand {

    public static void register(CommandDispatcher<CommandSourceStack> dispatcher, Commands.CommandSelection selection) {
        dispatcher.register(Commands.literal(Bourgeoisie.MOD_ID)
            .then(Commands.literal("fetch")
                    .then(Commands.argument("player", EntityArgument.player())
                    .executes(BourgeoisieCommand::fetch)
            ))
        );
    }

    private static int fetch(CommandContext<CommandSourceStack> ctx) throws CommandSyntaxException {

        Player player = EntityArgument.getPlayer(ctx, "player");
        int amount = 1;

        return amount;
    }

}
