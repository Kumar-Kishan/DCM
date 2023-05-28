#Get key from argument list
$key = "27e1e84a6ccc81e2e6f074473b1b7e8dc9ec48098ecfc4c97bba28a50d0161dc"

$delay = 4

for ($zone = 1; $zone -le 4; $zone++) {
    Write-Output "Starting zone $zone"
    for ($rack = 1; $rack -le 5; $rack++) {
        Write-Output "Starting rack $rack"
        for ($server = 1; $server -le 5; $server++) {
            Write-Output "Starting server $server"
            $cmd = "docker run -e ZONE=zone-$zone -e RACK=rack-$rack -e SERVER=server-$server -e KEY=$key -d --name agent-$zone-$rack-$server agent"
            Start-Process -FilePath "cmd.exe" -ArgumentList "/c $cmd" -WindowStyle Hidden
            Start-Sleep -Seconds $delay
        }
        $delay += 2
    }
}
