package com.possible_triangle.database

import com.mojang.brigadier.exceptions.CommandExceptionType
import com.mojang.brigadier.exceptions.CommandSyntaxException
import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration
import net.minecraft.world.entity.player.Player
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object ApiClient {

    @Serializable
    data class Login(val access_key: String?, val password: String?)

    @Serializable
    data class Token(val token: String)

    private val HOST = "localhost:8001"
    private val BASE_URL = "http://$HOST/api/"
    private val JSON = Json(JsonConfiguration(ignoreUnknownKeys = true))

    private var token: String? = null

    private fun saveLogin(login: Login) {

    }

    private fun readSavedLogin(): Login {
        return Login(null, null)
    }

    fun start(password: String?) {
        val savedLogin = readSavedLogin()
        val body = JSON.stringify(Login.serializer(), Login(savedLogin.access_key, password ?: savedLogin.password))

        val login = if(savedLogin.access_key != null) {
            post(Token.serializer(), "auth", body)
        } else {
            post(Token.serializer(), "auth/register", body)
        }

        saveLogin(Login(null, null))
        token = login.token
    }

    private fun searchWallets(owner: Player): String {
        if(token == null) throw Error("Service not started")
        val uuid = owner.uuid.toString()
        return get("wallet?owner=$uuid")
    }

    @Serializable
    data class Wallet(val cash: Int? = null, val name: String, val owner: String?)

    fun fetchWallet(owner: Player) {
        val wallets = searchWallets(owner)
        print(wallets)
    }

    fun createWallet(owner: Player, name: String = owner.displayName.toString()) {
        val body = JSON.stringify(Wallet.serializer(), Wallet(null, name, owner.uuid.toString()))
        post("wallet", body)
    }

    private fun get(endpoint: String): String {
        return method("GET", endpoint)
    }

    private fun post(endpoint: String, body: String? = null): String {
        return method("POST", endpoint, body)
    }

    private fun put(endpoint: String, body: String? = null): String {
        return method("PUT", endpoint, body)
    }

    private fun <T> get(serializer: DeserializationStrategy<T>, endpoint: String): T {
        return method(serializer, "GET", endpoint)
    }

    private fun <T> post(serializer: DeserializationStrategy<T>, endpoint: String, body: String? = null): T {
        return method(serializer, "POST", endpoint, body)
    }

    private fun <T> put(serializer: DeserializationStrategy<T>, endpoint: String, body: String? = null): T {
        return method(serializer, "PUT", endpoint, body)
    }

    private fun <T> method(serializer: DeserializationStrategy<T>, method: String, endpoint: String, body: String? = null): T {
        val json = method(method, endpoint, body)
        return JSON.parse(serializer, json)
    }

    private fun method(method: String, endpoint: String, body: String? = null): String {
        val url = URL(BASE_URL + endpoint)
        with(url.openConnection() as HttpURLConnection) {
            requestMethod = method

            if (token != null) setRequestProperty("Authorization", "Token $token")

            if (body != null) {
                doOutput = true
                val wr = OutputStreamWriter(outputStream);
                wr.write(body);
                wr.flush();
            }

            val response = StringBuffer()
            BufferedReader(InputStreamReader(inputStream)).use {

                var inputLine = it.readLine()
                while (inputLine != null) {
                    response.append(inputLine)
                    inputLine = it.readLine()
                }

            }

            return response.toString()
        }
    }

}