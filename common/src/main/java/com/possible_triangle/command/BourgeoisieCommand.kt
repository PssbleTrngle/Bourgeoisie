package com.possible_triangle.command

import com.mojang.brigadier.CommandDispatcher
import com.mojang.brigadier.arguments.StringArgumentType
import com.mojang.brigadier.context.CommandContext
import com.mojang.brigadier.exceptions.CommandSyntaxException
import com.possible_triangle.Bourgeoisie
import com.possible_triangle.database.ApiClient
import me.shedaniel.architectury.event.events.CommandRegistrationEvent
import net.minecraft.commands.CommandSourceStack
import net.minecraft.commands.Commands
import net.minecraft.commands.arguments.EntityArgument
import net.minecraft.world.entity.player.Player

object BourgeoisieCommand: CommandRegistrationEvent {

    override fun register(dispatcher: CommandDispatcher<CommandSourceStack>, selection: Commands.CommandSelection) {
        dispatcher.register(Commands.literal(Bourgeoisie.MOD_ID)
                .then(Commands.literal("fetch")
                        .then(Commands.argument("player", EntityArgument.player())
                                .executes { fetch(it) }
                        )
                ).then(Commands.literal("start")
                        .then(Commands.argument("password", StringArgumentType.string())
                                .executes { start(it) }
                        ).executes { start(it) }
                )
        )
    }

    @Throws(CommandSyntaxException::class)
    private fun start(ctx: CommandContext<CommandSourceStack>): Int {
        val password = try {
            StringArgumentType.getString(ctx, "password")
        } catch (ex: IllegalArgumentException) {
            null
        }
        ApiClient.start(password)
        return 1
    }

    @Throws(CommandSyntaxException::class)
    private fun fetch(ctx: CommandContext<CommandSourceStack>): Int {
        val player: Player = EntityArgument.getPlayer(ctx, "player")
        ApiClient.fetchWallet(player)
        return 1
    }
}